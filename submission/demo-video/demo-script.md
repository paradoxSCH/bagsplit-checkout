# BagSplit Checkout Demo Script

Target length: 3-5 minutes.

## 1. Problem

Creators can launch and trade tokens on Bags, but most creator tokens still lack everyday commerce use cases. BagSplit Checkout gives those tokens a simple way to become payment instruments for creator products.

## 2. Product

BagSplit Checkout lets creators create token-powered checkout links for digital drops, memberships, event tickets, and fan services.

## 3. Demo Flow

1. Open the homepage and explain the Payments focus.
2. Point out the live Bags connection and token leaderboard snapshot.
3. Click `Create checkout`.
4. Show the prefilled creator checkout form.
5. Create or open the generated checkout.
6. Simulate a fan payment.
7. Show the receipt and the devnet transaction proof verifier.
8. Paste a devnet transaction signature if one is available, or explain that the verifier accepts real devnet signatures without mainnet gas.
9. Open the creator dashboard and show orders / mock volume.

## 4. Bags Integration Talking Points

- Bags API Key is loaded server-side through `.env.local`.
- The readiness, status, and auth probe endpoints expose integration health without returning secrets or account profile data.
- The ecosystem snapshot endpoint reads Bags token leaderboard data and returns only sanitized token summaries.
- BSPAY is the planned project token for the demo checkout flow.
- Real Solana devnet signatures can be verified at the receipt boundary without mainnet gas.

## 5. Closing

BagSplit Checkout is not another token analytics dashboard. It is a commerce layer for creator tokens: a reason for creator tokens to be used after launch.