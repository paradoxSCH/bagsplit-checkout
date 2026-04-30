import { describe, expect, it } from "vitest";

import { verifyDevnetTransactionProof, verifySolanaProofInputSchema } from "./solana";

const validSignature = "2Ana1pUpv2ZbMVkwF5FXapYeBEjdxDatLn7nvJkhgTSXbs59SyZSx866bXirPgj8QQVB57uxHJBG1YFvkRbFj4T";

describe("Solana devnet proof", () => {
  it("rejects invalid transaction signatures before calling RPC", async () => {
    const result = await verifyDevnetTransactionProof("mock_sig_creator_pass_1001", {
      getSignatureStatuses: async () => {
        throw new Error("should not call RPC");
      },
    });

    expect(result).toEqual({
      checked: true,
      verified: false,
      network: "devnet",
      signature: "mock_sig_creator_pass_1001",
      reason: "invalid",
    });
  });

  it("verifies confirmed devnet signatures", async () => {
    const result = await verifyDevnetTransactionProof(validSignature, {
      getSignatureStatuses: async () => ({
        context: { slot: 123 },
        value: [
          {
            slot: 456,
            confirmations: null,
            err: null,
            confirmationStatus: "confirmed",
          },
        ],
      }),
    });

    expect(result).toEqual({
      checked: true,
      verified: true,
      network: "devnet",
      signature: validSignature,
      slot: 456,
      confirmationStatus: "confirmed",
      explorerUrl: `https://explorer.solana.com/tx/${validSignature}?cluster=devnet`,
    });
  });

  it("returns not-found for missing signatures", async () => {
    const result = await verifyDevnetTransactionProof(validSignature, {
      getSignatureStatuses: async () => ({ context: { slot: 123 }, value: [null] }),
    });

    expect(result.verified).toBe(false);
    expect(result.reason).toBe("not-found");
  });

  it("validates base58 signature shape", () => {
    expect(verifySolanaProofInputSchema.safeParse({ signature: validSignature }).success).toBe(true);
    expect(verifySolanaProofInputSchema.safeParse({ signature: "not a signature" }).success).toBe(false);
  });
});
