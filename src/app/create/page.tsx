import Link from "next/link";

import { CreateCheckoutForm } from "@/components/checkout/CreateCheckoutForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-950">
      <div className="mx-auto grid w-full max-w-5xl gap-8">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="font-medium text-stone-700 hover:text-stone-950">
            BagSplit Checkout
          </Link>
          <Link href="/dashboard" className="rounded-md border border-stone-300 px-3 py-2 font-medium hover:bg-white">
            Creator dashboard
          </Link>
        </nav>

        <section className="grid gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Creator workflow</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">Create a token-powered checkout link.</h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            This mock creator flow captures the MVP fields needed to sell a membership, drop, ticket, or service with BSPAY or a Bags creator token.
          </p>
        </section>

        <CreateCheckoutForm />
      </div>
    </main>
  );
}