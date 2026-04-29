"use client";

import { useState } from "react";

import { orderSchema } from "@/lib/checkout";

type MockPaymentButtonProps = {
  checkoutItemId: string;
};

const demoBuyerWallet = "FanWalletDemo111111111111111111111111111111";

export function MockPaymentButton({ checkoutItemId }: MockPaymentButtonProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setIsPaying(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutItemId, buyerWallet: demoBuyerWallet }),
      });
      const data = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error("Payment simulation failed.");
      }

      const parsed = orderSchema.safeParse((data as { order?: unknown }).order);

      if (!parsed.success) {
        throw new Error("Order response was invalid.");
      }

      window.location.href = parsed.data.receiptUrl;
    } catch {
      setError("Payment simulation is temporarily unavailable. Try again after the local API is running.");
      setIsPaying(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isPaying}
        className="flex h-11 items-center justify-center rounded-md bg-emerald-400 px-4 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-500 disabled:text-stone-200"
      >
        {isPaying ? "Simulating..." : "Simulate payment"}
      </button>
      {error ? <p className="rounded-md bg-red-950/40 px-3 py-2 text-sm text-red-100">{error}</p> : null}
    </div>
  );
}
