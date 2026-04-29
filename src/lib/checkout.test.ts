import { describe, expect, it } from "vitest";

import {
  createCheckoutInputSchema,
  createMockOrder,
  createMockCheckout,
  demoOrders,
  getCheckoutItem,
  getOrdersForCreator,
  saveMockCheckout,
  summarizeOrders,
} from "./checkout";

describe("checkout domain", () => {
  it("validates checkout creation input", () => {
    const result = createCheckoutInputSchema.safeParse({
      creatorWallet: "CreatorWallet1111111111111111111111111111",
      creatorProjectName: "BagSplit Studio",
      title: "Token-gated workshop",
      description: "A checkout item for a paid creator workshop.",
      priceAmount: 12,
      priceTokenMint: "BSPAYMint111111111111111111111111111111",
      priceTokenSymbol: "BSPAY",
      deliveryType: "event",
      inventoryLimit: 40,
      expiresAt: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid prices", () => {
    const result = createCheckoutInputSchema.safeParse({
      creatorWallet: "CreatorWallet1111111111111111111111111111",
      creatorProjectName: "BagSplit Studio",
      title: "Token-gated workshop",
      description: "A checkout item for a paid creator workshop.",
      priceAmount: 0,
      priceTokenMint: "BSPAYMint111111111111111111111111111111",
      priceTokenSymbol: "BSPAY",
      deliveryType: "event",
      inventoryLimit: 40,
      expiresAt: null,
    });

    expect(result.success).toBe(false);
  });

  it("creates a mock checkout with an active status", () => {
    const checkout = createMockCheckout({
      creatorWallet: "CreatorWallet1111111111111111111111111111",
      creatorProjectName: "BagSplit Studio",
      title: "Private Notes Drop",
      description: "A creator note drop paid with creator tokens.",
      priceAmount: 8,
      priceTokenMint: "BSPAYMint111111111111111111111111111111",
      priceTokenSymbol: "BSPAY",
      deliveryType: "download",
      inventoryLimit: null,
      expiresAt: null,
    });

    expect(checkout.id).toBe("private-notes-drop");
    expect(checkout.status).toBe("active");
  });

  it("saves a mock checkout for generated links", () => {
    const checkout = saveMockCheckout({
      creatorWallet: "CreatorWallet1111111111111111111111111111",
      creatorProjectName: "BagSplit Studio",
      title: "Generated Link Pass",
      description: "A saved checkout item that can be opened through its generated link.",
      priceAmount: 10,
      priceTokenMint: "BSPAYMint111111111111111111111111111111",
      priceTokenSymbol: "BSPAY",
      deliveryType: "membership",
      inventoryLimit: 25,
      expiresAt: null,
    });

    expect(checkout.id).toBe("generated-link-pass");
    expect(getCheckoutItem(checkout.id).title).toBe("Generated Link Pass");
  });

  it("summarizes creator orders", () => {
    const orders = getOrdersForCreator("BagSplitCreator111111111111111111111111111");
    const summary = summarizeOrders(orders);

    expect(summary.orderCount).toBe(demoOrders.length);
    expect(summary.paidCount).toBe(demoOrders.length);
    expect(summary.totalVolume).toBeGreaterThan(0);
  });

  it("creates a paid mock order from a checkout item", () => {
    const order = createMockOrder({
      checkoutItemId: "creator-pass",
      buyerWallet: "FanWalletDemo111111111111111111111111111111",
    });

    expect(order.checkoutItemId).toBe("creator-pass");
    expect(order.status).toBe("paid");
    expect(order.amountPaid).toBeGreaterThan(0);
    expect(order.receiptUrl).toContain(order.id);
  });
});