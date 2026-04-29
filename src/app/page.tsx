import Link from "next/link";

import { BagsHealthPanel } from "@/components/bags/BagsHealthPanel";

const useCases = [
  {
    title: "Digital drops",
    description: "Sell notes, assets, downloads, and early access drops with BSPAY or a Bags creator token.",
  },
  {
    title: "Membership passes",
    description: "Create token-powered checkout links for private communities, creator rooms, and paid updates.",
  },
  {
    title: "Event tickets",
    description: "Let fans pay for live rooms, workshops, and launch events with creator-aligned assets.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-lg border border-stone-200 bg-stone-950 text-stone-100 shadow-sm">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.5fr_1fr] lg:px-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-md border border-emerald-300/30 bg-emerald-200/10 px-3 py-1 text-sm tracking-[0.2em] text-emerald-200 uppercase">
                BagSplit Checkout
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Creator-token checkout links for Bags commerce.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                Turn creator tokens into payment links for digital goods, memberships, event tickets, and fan services. The current build uses mock payments while keeping the product path ready for Bags API and Solana transaction proof.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/create" className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300">
                  Create checkout
                </Link>
                <Link href="/checkout/creator-pass" className="rounded-md border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-900">
                  View demo checkout
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-5">
                <div className="text-sm uppercase tracking-[0.18em] text-stone-400">Track</div>
                <div className="mt-3 text-3xl font-semibold text-emerald-200">Payments</div>
                <p className="mt-2 text-sm leading-6 text-stone-400">A clearer real-world path than another trading dashboard.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-5">
                <div className="text-sm uppercase tracking-[0.18em] text-stone-400">Token</div>
                <div className="mt-3 text-3xl font-semibold">BSPAY</div>
                <p className="mt-2 text-sm leading-6 text-stone-400">Planned token name: BagSplit Pay.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-5">
                <div className="text-sm uppercase tracking-[0.18em] text-stone-400">Status</div>
                <div className="mt-3 text-3xl font-semibold">Mock MVP</div>
                <p className="mt-2 text-sm leading-6 text-stone-400">Ready for staged Bags/Solana integration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Commerce use cases</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  The MVP focuses on small, believable creator purchases instead of a broad payment gateway.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {useCases.map((useCase) => (
                <article
                  key={useCase.title}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-5"
                >
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{useCase.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <BagsHealthPanel />

            <section className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold">Demo path</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Create a checkout, simulate a buyer payment, open the receipt, then review creator orders in the dashboard.
              </p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex rounded-md bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
              >
                Open dashboard
              </Link>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
