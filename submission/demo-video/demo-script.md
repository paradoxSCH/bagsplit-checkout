# BagSplit Checkout Demo Script

Target length: 3-5 minutes.

## 1. Problem

Creators can launch and trade tokens on Bags, but most creator tokens still lack everyday commerce use cases. BagSplit Checkout gives those tokens a simple way to become payment instruments for creator products.

## 2. Product

BagSplit Checkout lets creators create token-powered checkout links for digital drops, memberships, event tickets, and fan services.

## 3. Demo Flow

1. Open the homepage and explain the Payments focus.
2. Click `Create checkout`.
3. Show the prefilled creator checkout form.
4. Create or open the generated checkout.
5. Simulate a fan payment.
6. Show the receipt with payment signature placeholder.
7. Open the creator dashboard and show orders / mock volume.

## 4. Bags Integration Talking Points

- Bags API Key is loaded server-side through `.env.local`.
- The readiness, status, and auth probe endpoints expose integration health without returning secrets or account profile data.
- BSPAY is the planned project token for the demo checkout flow.
- Real payment verification can be connected at the existing checkout and receipt boundary.

## 5. Closing

BagSplit Checkout is not another token analytics dashboard. It is a commerce layer for creator tokens: a reason for creator tokens to be used after launch.