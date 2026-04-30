"use client";

import { useState } from "react";

type ProofState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "verified"; explorerUrl: string; slot: number; confirmationStatus: string }
  | { status: "rejected"; reason: string }
  | { status: "error" };

type DevnetProofVerifierProps = {
  defaultSignature?: string;
};

export function DevnetProofVerifier({ defaultSignature = "" }: DevnetProofVerifierProps) {
  const [signature, setSignature] = useState(defaultSignature.startsWith("mock_sig_") ? "" : defaultSignature);
  const [proofState, setProofState] = useState<ProofState>({ status: "idle" });

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProofState({ status: "checking" });

    try {
      const response = await fetch("/api/solana/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const data = (await response.json()) as {
        verified?: boolean;
        reason?: string;
        explorerUrl?: string;
        slot?: number;
        confirmationStatus?: string;
      };

      if (response.ok && data.verified && data.explorerUrl && typeof data.slot === "number") {
        setProofState({
          status: "verified",
          explorerUrl: data.explorerUrl,
          slot: data.slot,
          confirmationStatus: data.confirmationStatus ?? "confirmed",
        });
        return;
      }

      setProofState({ status: "rejected", reason: data.reason ?? "invalid" });
    } catch {
      setProofState({ status: "error" });
    }
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Devnet proof</p>
      <h2 className="mt-3 text-2xl font-semibold">Verify Solana transaction</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Paste a Solana devnet transaction signature to attach verifiable chain proof to this receipt.
      </p>

      <form onSubmit={handleVerify} className="mt-5 grid gap-3">
        <label htmlFor="solana-signature" className="text-sm font-medium text-stone-800">
          Devnet transaction signature
        </label>
        <textarea
          id="solana-signature"
          value={signature}
          onChange={(event) => setSignature(event.target.value.trim())}
          rows={3}
          placeholder="Paste a devnet signature"
          className="rounded-md border border-stone-300 px-3 py-2 font-mono text-xs outline-none focus:border-stone-900"
        />
        <button
          type="submit"
          disabled={proofState.status === "checking" || signature.length === 0}
          className="w-fit rounded-md bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {proofState.status === "checking" ? "Verifying..." : "Verify devnet proof"}
        </button>
      </form>

      {proofState.status === "verified" ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-medium">Verified on devnet</p>
          <p className="mt-2">
            Slot {proofState.slot} · {proofState.confirmationStatus}
          </p>
          <a
            href={proofState.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex font-medium underline underline-offset-4"
          >
            Open Solana Explorer
          </a>
        </div>
      ) : null}

      {proofState.status === "rejected" ? (
        <p className="mt-5 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Devnet proof was not verified: {proofState.reason}.
        </p>
      ) : null}

      {proofState.status === "error" ? (
        <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">
          Proof verification is temporarily unavailable.
        </p>
      ) : null}
    </section>
  );
}
