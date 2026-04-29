import Link from "next/link";

import { demoCheckoutItems, getOrdersForCreator, summarizeOrders } from "@/lib/checkout";

export default function DashboardPage() {
  const creator = demoCheckoutItems[0].creatorWallet;
  const orders = getOrdersForCreator(creator);
  const summary = summarizeOrders(orders);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="font-medium text-stone-700 hover:text-stone-950">
            BagSplit Checkout
          </Link>
          <Link href="/create" className="rounded-md bg-stone-950 px-3 py-2 font-medium text-white hover:bg-stone-800">
            Create checkout
          </Link>
        </nav>

        <section>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Creator dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Orders and revenue from token-powered checkout.</h1>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-600">Orders</p>
            <p className="mt-2 text-3xl font-semibold">{summary.orderCount}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-600">Paid orders</p>
            <p className="mt-2 text-3xl font-semibold">{summary.paidCount}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-600">Mock volume</p>
            <p className="mt-2 text-3xl font-semibold">{summary.totalVolume.toFixed(2)}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <h2 className="text-xl font-semibold">Recent orders</h2>
          </div>
          <div className="divide-y divide-stone-200">
            {orders.map((order) => (
              <Link key={order.id} href={order.receiptUrl} className="grid gap-2 p-5 hover:bg-stone-50 md:grid-cols-4">
                <span className="font-medium">{order.id}</span>
                <span>{order.status}</span>
                <span>{order.amountPaid}</span>
                <span className="break-all font-mono text-xs text-stone-500">{order.paymentSignature}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}