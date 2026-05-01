# BagSplit Checkout

[中文说明](README.zh-CN.md)

Creator-token checkout links for digital goods, memberships, events, and fan purchases on Bags.

BagSplit Checkout is a runnable hackathon demo that turns creator tokens into a commerce flow: a creator creates a checkout link, a fan opens the link, payment is simulated, a receipt is generated, and the creator can review orders in a dashboard.

## Hackathon Positioning

- Track: Payments
- Planned project token: BagSplit Pay (`BSPAY`)
- Core idea: give Bags creator tokens a practical use case beyond launch and trading
- Demo status: API-backed mock checkout and order flow, live Bags SDK health checks, sanitized Bags leaderboard snapshot, and Solana devnet transaction proof verification

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Bags SDK
- Solana Web3
- TanStack Query
- Zod
- Vitest and Playwright

## Quick Start

```bash
npm install --legacy-peer-deps --ignore-scripts
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Required environment values are listed in `.env.example`. Keep `.env.local` private.

## Quality Gates

```bash
npm run lint
npm run test
npm run build
npm run check
npm run test:e2e
```

GitHub Actions runs `npm run check` and the Playwright happy path on pushes and pull requests to `master`.

## Demo Flow

1. Open the homepage and view the live Bags integration panel.
2. Create a checkout item.
3. Open the generated public checkout link.
4. Simulate payment through the orders API.
5. Paste a Solana devnet transaction signature on the receipt to verify chain proof.
6. View orders and volume in the creator dashboard.

## Bags And Solana Integration

- `src/app/api/bags/status/route.ts`: safe Bags integration status endpoint
- `src/app/api/bags/auth/route.ts`: server-side Bags auth connectivity probe
- `src/app/api/bags/ecosystem/route.ts`: sanitized Bags token leaderboard snapshot
- `src/app/api/solana/proof/route.ts`: Solana devnet transaction signature verifier

The Bags API key is read only on the server and is never returned to the browser. Bags leaderboard data is sanitized before display. Receipt pages can verify real Solana devnet transaction signatures through the server-side proof endpoint.

## Important Paths

- `src/app/page.tsx`: demo landing page
- `src/app/create/page.tsx`: creator checkout form
- `src/app/checkout/[id]/page.tsx`: public checkout page
- `src/app/receipt/[id]/page.tsx`: receipt and devnet proof page
- `src/app/dashboard/page.tsx`: creator order dashboard
- `src/app/api/checkouts/route.ts`: checkout item API
- `src/app/api/orders/route.ts`: order API
- `src/app/api/demo/reset/route.ts`: demo data reset endpoint
- `submission/`: public submission assets and demo script

## Deployment

The repo includes `vercel.json` so Vercel uses the same dependency flags as local development.

Set these environment variables in the deployment provider:

- `BAGS_API_KEY`
- `BAGS_API_BASE_URL`
- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `NEXT_PUBLIC_APP_NAME`

## Current Limits

- Checkout and order creation use an in-memory mock store for demo speed.
- Payment is simulated, while receipt proof verification accepts real Solana devnet transaction signatures.
- The planned `BSPAY` token must still be launched or linked on Bags before final hackathon submission.
