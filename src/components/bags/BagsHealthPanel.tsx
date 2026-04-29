"use client";

import { useEffect, useState } from "react";

type BagsAuthState =
  | { status: "checking" }
  | { status: "connected" }
  | { status: "unavailable" };

type BagsEcosystemState =
  | { status: "checking" }
  | { status: "connected"; tokenCount: number; sampleTokens: Array<{ token: string; symbol: string | null; name: string | null }> }
  | { status: "unavailable" };

export function BagsHealthPanel() {
  const [authState, setAuthState] = useState<BagsAuthState>({ status: "checking" });
  const [ecosystemState, setEcosystemState] = useState<BagsEcosystemState>({ status: "checking" });

  useEffect(() => {
    let isActive = true;

    async function loadStatus() {
      try {
        const [authResponse, ecosystemResponse] = await Promise.all([
          fetch("/api/bags/auth", { cache: "no-store" }),
          fetch("/api/bags/ecosystem", { cache: "no-store" }),
        ]);
        const authData = (await authResponse.json()) as { connected?: boolean };
        const ecosystemData = (await ecosystemResponse.json()) as {
          connected?: boolean;
          tokenCount?: number;
          sampleTokens?: Array<{ token: string; symbol: string | null; name: string | null }>;
        };

        if (isActive) {
          setAuthState({ status: authResponse.ok && authData.connected ? "connected" : "unavailable" });
          setEcosystemState(
            ecosystemResponse.ok && ecosystemData.connected
              ? {
                  status: "connected",
                  tokenCount: ecosystemData.tokenCount ?? 0,
                  sampleTokens: ecosystemData.sampleTokens ?? [],
                }
              : { status: "unavailable" },
          );
        }
      } catch {
        if (isActive) {
          setAuthState({ status: "unavailable" });
          setEcosystemState({ status: "unavailable" });
        }
      }
    }

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, []);

  const copy = {
    checking: {
      label: "Checking",
      detail: "Verifying server-side Bags API access.",
      tone: "border-amber-200 bg-amber-50 text-amber-900",
    },
    connected: {
      label: "Connected",
      detail: "Bags API key is valid and profile access is reachable.",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    unavailable: {
      label: "Unavailable",
      detail: "The demo can still run with mock checkout data.",
      tone: "border-stone-200 bg-stone-50 text-stone-700",
    },
  }[authState.status];

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Live integration</p>
          <h2 className="mt-3 text-2xl font-semibold">Bags connection</h2>
        </div>
        <span className={`rounded-md border px-3 py-1 text-sm font-medium ${copy.tone}`}>{copy.label}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-700">{copy.detail}</p>
      <div className="mt-5 rounded-md bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-950">Ecosystem snapshot</p>
        {ecosystemState.status === "checking" ? (
          <p className="mt-2 text-sm text-stone-600">Loading Bags token leaderboard.</p>
        ) : null}
        {ecosystemState.status === "unavailable" ? (
          <p className="mt-2 text-sm text-stone-600">Token leaderboard is unavailable in this environment.</p>
        ) : null}
        {ecosystemState.status === "connected" ? (
          <div className="mt-3 grid gap-3">
            <p className="text-sm text-stone-700">Read {ecosystemState.tokenCount} Bags token records from the SDK.</p>
            {ecosystemState.sampleTokens.length > 0 ? (
              <ul className="grid gap-2 text-sm text-stone-700">
                {ecosystemState.sampleTokens.map((token) => (
                  <li key={token.token} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
                    <span className="font-medium text-stone-950">{token.symbol ?? token.name ?? "Token"}</span>
                    <span className="max-w-36 truncate font-mono text-xs text-stone-500">{token.token}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}