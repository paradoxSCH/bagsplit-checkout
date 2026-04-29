import { z } from "zod";

export const deliveryTypes = ["download", "membership", "event", "service", "custom"] as const;
export const checkoutStatuses = ["draft", "active", "archived"] as const;
export const orderStatuses = ["pending", "paid", "failed", "fulfilled"] as const;

export const checkoutItemSchema = z.object({
  id: z.string().min(3),
  creatorWallet: z.string().min(6),
  creatorProjectName: z.string().min(2),
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(280),
  priceAmount: z.number().positive(),
  priceTokenMint: z.string().min(6),
  priceTokenSymbol: z.string().min(2).max(12),
  deliveryType: z.enum(deliveryTypes),
  inventoryLimit: z.number().int().positive().nullable(),
  expiresAt: z.string().datetime().nullable(),
  status: z.enum(checkoutStatuses),
  createdAt: z.string().datetime(),
});

export const createCheckoutInputSchema = checkoutItemSchema.omit({
  id: true,
  createdAt: true,
  status: true,
});

export const orderSchema = z.object({
  id: z.string().min(3),
  checkoutItemId: z.string().min(3),
  buyerWallet: z.string().min(6),
  amountPaid: z.number().positive(),
  paymentTokenMint: z.string().min(6),
  paymentSignature: z.string().min(8),
  status: z.enum(orderStatuses),
  receiptUrl: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutInputSchema>;
export type Order = z.infer<typeof orderSchema>;

export const demoCheckoutItems: CheckoutItem[] = [
  {
    id: "creator-pass",
    creatorWallet: "BagSplitCreator111111111111111111111111111",
    creatorProjectName: "BagSplit Studio",
    title: "Creator Launch Room Pass",
    description:
      "A token-powered room pass for launch updates, private notes, and early product drops from a Bags creator.",
    priceAmount: 24,
    priceTokenMint: "BSPAYMint111111111111111111111111111111",
    priceTokenSymbol: "BSPAY",
    deliveryType: "membership",
    inventoryLimit: 100,
    expiresAt: "2026-06-02T05:30:00.000Z",
    status: "active",
    createdAt: "2026-04-30T00:00:00.000Z",
  },
  {
    id: "drop-ticket",
    creatorWallet: "BagSplitCreator111111111111111111111111111",
    creatorProjectName: "BagSplit Studio",
    title: "Private Drop Ticket",
    description:
      "A checkout link for a limited creator drop, built to show how Bags tokens can unlock commerce instead of only trading.",
    priceAmount: 0.25,
    priceTokenMint: "So11111111111111111111111111111111111111112",
    priceTokenSymbol: "SOL",
    deliveryType: "event",
    inventoryLimit: 50,
    expiresAt: "2026-06-02T05:30:00.000Z",
    status: "active",
    createdAt: "2026-04-30T00:00:00.000Z",
  },
];

const checkoutItems: CheckoutItem[] = [...demoCheckoutItems];

export const demoOrders: Order[] = [
  {
    id: "order-1001",
    checkoutItemId: "creator-pass",
    buyerWallet: "FanWallet1111111111111111111111111111111111",
    amountPaid: 24,
    paymentTokenMint: "BSPAYMint111111111111111111111111111111",
    paymentSignature: "mock_sig_creator_pass_1001",
    status: "paid",
    receiptUrl: "/receipt/order-1001",
    createdAt: "2026-04-30T00:15:00.000Z",
  },
  {
    id: "order-1002",
    checkoutItemId: "drop-ticket",
    buyerWallet: "FanWallet2222222222222222222222222222222222",
    amountPaid: 0.25,
    paymentTokenMint: "So11111111111111111111111111111111111111112",
    paymentSignature: "mock_sig_drop_ticket_1002",
    status: "fulfilled",
    receiptUrl: "/receipt/order-1002",
    createdAt: "2026-04-30T00:30:00.000Z",
  },
];

export function listCheckoutItems() {
  return checkoutItems;
}

export function getCheckoutItem(id: string) {
  return checkoutItems.find((item) => item.id === id) ?? demoCheckoutItems[0];
}

export function getOrder(id: string) {
  return demoOrders.find((order) => order.id === id) ?? demoOrders[0];
}

export function getOrdersForCreator(creatorWallet: string) {
  const creatorCheckoutIds = checkoutItems
    .filter((item) => item.creatorWallet === creatorWallet)
    .map((item) => item.id);

  return demoOrders.filter((order) => creatorCheckoutIds.includes(order.checkoutItemId));
}

export function summarizeOrders(orders: Order[]) {
  return orders.reduce(
    (summary, order) => ({
      orderCount: summary.orderCount + 1,
      paidCount: summary.paidCount + (order.status === "paid" || order.status === "fulfilled" ? 1 : 0),
      totalVolume: summary.totalVolume + order.amountPaid,
    }),
    { orderCount: 0, paidCount: 0, totalVolume: 0 },
  );
}

export function createMockCheckout(input: CreateCheckoutInput): CheckoutItem {
  return checkoutItemSchema.parse({
    ...input,
    id: slugify(input.title),
    status: "active",
    createdAt: new Date().toISOString(),
  });
}

export function saveMockCheckout(input: CreateCheckoutInput): CheckoutItem {
  const checkout = createMockCheckout(input);
  const existingIndex = checkoutItems.findIndex((item) => item.id === checkout.id);

  if (existingIndex >= 0) {
    checkoutItems[existingIndex] = checkout;
  } else {
    checkoutItems.unshift(checkout);
  }

  return checkout;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug.length >= 3 ? slug : `checkout-${Date.now()}`;
}