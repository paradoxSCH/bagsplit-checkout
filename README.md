# BagSplit Checkout

Creator-token checkout links for digital goods, memberships, events, and fan purchases on Bags.

BagSplit Checkout is a runnable hackathon demo that shows how a creator can create a checkout link, share it with fans, simulate token payment, generate a receipt, and review orders in a creator dashboard.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Bags SDK
- Solana Web3 + Wallet Adapter
- TanStack Query
- Zod

## Quick Start

```bash
npm install
copy .env.example .env.local
npm run dev
```

打开 http://localhost:3000。

Required environment values are listed in `.env.example`. Keep `.env.local` private.

## Quality Gates

```bash
npm run lint
npm run test
npm run build
npm run check
```

GitHub Actions runs `npm run check` and the Playwright happy path on pushes and pull requests to `master`.

## Important Paths

- `src/app/page.tsx`: demo landing page
- `src/app/create/page.tsx`: creator checkout form
- `src/app/checkout/[id]/page.tsx`: public checkout page
- `src/app/receipt/[id]/page.tsx`: payment receipt page
- `src/app/dashboard/page.tsx`: creator order dashboard
- `src/app/api/ready/route.ts`: safe readiness endpoint
- `src/app/api/bags/status/route.ts`: safe Bags integration status endpoint
- `src/app/api/bags/auth/route.ts`: safe Bags auth connectivity probe
- `src/app/api/bags/ecosystem/route.ts`: sanitized Bags token leaderboard snapshot
- `src/app/api/solana/proof/route.ts`: Solana devnet transaction signature verifier
- `submission/`: public submission assets and demo script

## Demo Flow

1. Open the homepage.
2. Create a checkout item.
3. Open the public checkout link.
4. Simulate payment.
5. Paste a Solana devnet transaction signature on the receipt to verify chain proof.
6. View the creator dashboard.

## Deployment

The repo includes `vercel.json` so Vercel uses the same dependency flags as local development.

Set these environment variables in the deployment provider:

- `BAGS_API_KEY`
- `BAGS_API_BASE_URL`
- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `NEXT_PUBLIC_APP_NAME`

## Notes

- Bags API 文档显示所有请求都需要 `x-api-key`。
- The Bags API key is only read server-side and is never returned by API responses.
- The homepage reads Bags auth and token leaderboard status through server-side SDK routes, then displays sanitized health and ecosystem data.
- The current checkout/payment flow uses mock order data while preserving the integration boundary for real Bags and Solana payment verification.
- Receipt pages can verify real Solana devnet transaction signatures through the server-side RPC proof endpoint.
