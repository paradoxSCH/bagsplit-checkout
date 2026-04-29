"use client";

import { useEffect, useState } from "react";

type BagsAuthState =
  | { status: "checking" }
  | { status: "connected" }
  | { status: "unavailable" };

export function BagsHealthPanel() {
  const [authState, setAuthState] = useState<BagsAuthState>({ status: "checking" });

  useEffect(() => {
    let isActive = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/bags/auth", { cache: "no-store" });
        const data = (await response.json()) as { connected?: boolean };

        if (isActive) {
          setAuthState({ status: response.ok && data.connected ? "connected" : "unavailable" });
        }
      } catch {
        if (isActive) {
          setAuthState({ status: "unavailable" });
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
    </section>
  );
}