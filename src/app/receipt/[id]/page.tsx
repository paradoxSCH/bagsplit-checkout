import Link from "next/link";

import { DevnetProofVerifier } from "@/components/checkout/DevnetProofVerifier";
import { getCheckoutItem, getOrder } from "@/lib/checkout";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  const item = getCheckoutItem(order.checkoutItemId);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-950">
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <Link href="/dashboard" className="text-sm font-medium text-stone-600 hover:text-stone-950">
          Creator dashboard
        </Link>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Receipt</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Payment confirmed</h1>
          <p className="mt-3 text-stone-600">This mock receipt shows the order proof BagSplit will connect to real Solana transaction signatures.</p>

          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between rounded-md bg-stone-50 p-3">
              <dt className="font-medium">Item</dt>
              <dd>{item.title}</dd>
            </div>
            <div className="flex justify-between rounded-md bg-stone-50 p-3">
              <dt className="font-medium">Amount</dt>
              <dd>
                {order.amountPaid} {item.priceTokenSymbol}
              </dd>
            </div>
            <div className="flex justify-between rounded-md bg-stone-50 p-3">
              <dt className="font-medium">Status</dt>
              <dd>{order.status}</dd>
            </div>
            <div className="grid gap-1 rounded-md bg-stone-50 p-3">
              <dt className="font-medium">Payment signature</dt>
              <dd className="break-all font-mono text-xs text-stone-600">{order.paymentSignature}</dd>
            </div>
          </dl>
        </section>

        <DevnetProofVerifier defaultSignature={order.paymentSignature} />
      </div>
    </main>
  );
}