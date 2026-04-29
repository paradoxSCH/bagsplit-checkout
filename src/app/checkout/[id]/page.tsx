import Link from "next/link";

import { MockPaymentButton } from "@/components/checkout/MockPaymentButton";
import { getCheckoutItem } from "@/lib/checkout";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCheckoutItem(id);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-950">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-950">
          BagSplit Checkout
        </Link>

        <section className="grid gap-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-emerald-800">
              {item.deliveryType}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
            <p className="text-base leading-7 text-stone-600">{item.description}</p>
            <dl className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
              <div className="rounded-md bg-stone-50 p-3">
                <dt className="font-medium text-stone-950">Creator</dt>
                <dd>{item.creatorProjectName}</dd>
              </div>
              <div className="rounded-md bg-stone-50 p-3">
                <dt className="font-medium text-stone-950">Inventory</dt>
                <dd>{item.inventoryLimit ?? "Unlimited"}</dd>
              </div>
            </dl>
          </div>

          <aside className="grid content-between gap-6 rounded-lg bg-stone-950 p-5 text-white">
            <div>
              <p className="text-sm text-stone-300">Total</p>
              <p className="mt-2 text-4xl font-semibold">
                {item.priceAmount} {item.priceTokenSymbol}
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Mock payment mode. Phase 4 will replace this with Bags/Solana transaction proof.
              </p>
            </div>
            <MockPaymentButton checkoutItemId={item.id} />
          </aside>
        </section>
      </div>
    </main>
  );
}