import bs58 from "bs58";
import { request } from "node:https";
import { z } from "zod";

const base58SignaturePattern = /^[1-9A-HJ-NP-Za-km-z]{64,128}$/;

export const verifySolanaProofInputSchema = z.object({
  signature: z.string().trim().regex(base58SignaturePattern, "Enter a valid Solana transaction signature."),
});

type SignatureStatus = {
  slot: number;
  confirmations: number | null;
  err: unknown;
  confirmationStatus: "processed" | "confirmed" | "finalized" | null;
};

type SignatureStatusClient = {
  getSignatureStatuses: (signatures: string[]) => Promise<{ value: Array<SignatureStatus | null> }>;
};

export type SolanaProofResult =
  | {
      checked: true;
      verified: true;
      network: "devnet";
      signature: string;
      slot: number;
      confirmationStatus: "confirmed" | "finalized";
      explorerUrl: string;
    }
  | {
      checked: true;
      verified: false;
      network: "devnet";
      signature: string;
      reason: "not-found" | "failed" | "unconfirmed" | "invalid" | "rpc-error";
      confirmationStatus?: string | null;
      explorerUrl?: string;
      error?: string;
    };

export function getSolanaRpcUrl() {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim() || "https://api.devnet.solana.com";
}

export function createSolanaRpcClient(): SignatureStatusClient {
  return {
    getSignatureStatuses: (signatures) => requestSignatureStatuses(signatures),
  };
}

export async function verifyDevnetTransactionProof(
  signature: string,
  connection: SignatureStatusClient = createSolanaRpcClient(),
): Promise<SolanaProofResult> {
  const parsed = verifySolanaProofInputSchema.safeParse({ signature });

  if (!parsed.success) {
    return {
      checked: true,
      verified: false,
      network: "devnet",
      signature,
      reason: "invalid",
    };
  }

  const normalizedSignature = parsed.data.signature;

  if (!isTransactionSignature(normalizedSignature)) {
    return {
      checked: true,
      verified: false,
      network: "devnet",
      signature: normalizedSignature,
      reason: "invalid",
    };
  }

  const explorerUrl = `https://explorer.solana.com/tx/${normalizedSignature}?cluster=devnet`;

  try {
    const response = await connection.getSignatureStatuses([normalizedSignature]);
    const status = response.value[0];

    if (!status) {
      return {
        checked: true,
        verified: false,
        network: "devnet",
        signature: normalizedSignature,
        reason: "not-found",
        explorerUrl,
      };
    }

    if (status.err) {
      return {
        checked: true,
        verified: false,
        network: "devnet",
        signature: normalizedSignature,
        reason: "failed",
        confirmationStatus: status.confirmationStatus,
        explorerUrl,
      };
    }

    if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") {
      return {
        checked: true,
        verified: true,
        network: "devnet",
        signature: normalizedSignature,
        slot: status.slot,
        confirmationStatus: status.confirmationStatus,
        explorerUrl,
      };
    }

    return {
      checked: true,
      verified: false,
      network: "devnet",
      signature: normalizedSignature,
      reason: "unconfirmed",
      confirmationStatus: status.confirmationStatus,
      explorerUrl,
    };
  } catch (error) {
    return {
      checked: true,
      verified: false,
      network: "devnet",
      signature: normalizedSignature,
      reason: "rpc-error",
      error: error instanceof Error ? error.name : "SolanaRpcError",
    };
  }
}

function isTransactionSignature(signature: string) {
  try {
    return bs58.decode(signature).length === 64;
  } catch {
    return false;
  }
}

async function requestSignatureStatuses(signatures: string[]) {
  const rpcUrl = new URL(getSolanaRpcUrl());
  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getSignatureStatuses",
    params: [signatures, { searchTransactionHistory: true }],
  });

  return new Promise<{ value: Array<SignatureStatus | null> }>((resolve, reject) => {
    const rpcRequest = request(
      {
        hostname: rpcUrl.hostname,
        path: `${rpcUrl.pathname}${rpcUrl.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            const parsed = JSON.parse(body) as { result?: { value?: Array<SignatureStatus | null> }; error?: unknown };

            if (parsed.error || !parsed.result?.value) {
              reject(new Error("Solana RPC returned an invalid response."));
              return;
            }

            resolve({ value: parsed.result.value });
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    rpcRequest.on("error", reject);
    rpcRequest.write(payload);
    rpcRequest.end();
  });
}
