import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CreateCheckoutForm } from "./CreateCheckoutForm";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("CreateCheckoutForm", () => {
  it("renders the default BagSplit checkout draft", () => {
    render(<CreateCheckoutForm />);

    expect(screen.getByLabelText("Checkout title")).toHaveValue("Creator Launch Room Pass");
    expect(screen.getByLabelText("Token")).toHaveValue("BSPAY");
    expect(screen.getByRole("button", { name: "Create mock checkout" })).toBeEnabled();
    expect(screen.queryByRole("link", { name: "Open generated checkout" })).not.toBeInTheDocument();
  });

  it("posts the draft and reveals the generated checkout link", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        checkout: {
          id: "creator-launch-room-pass",
          creatorWallet: "BagSplitCreator111111111111111111111111111",
          creatorProjectName: "BagSplit Studio",
          title: "Creator Launch Room Pass",
          description: "Private updates, launch notes, and member drops for early supporters.",
          priceAmount: 24,
          priceTokenMint: "BSPAYMint111111111111111111111111111111",
          priceTokenSymbol: "BSPAY",
          deliveryType: "membership",
          inventoryLimit: 100,
          expiresAt: null,
          status: "active",
          createdAt: "2026-04-30T00:00:00.000Z",
        },
      }),
    });

    render(<CreateCheckoutForm />);
    await user.click(screen.getByRole("button", { name: "Create mock checkout" }));

    expect(await screen.findByRole("link", { name: "Open generated checkout" })).toHaveAttribute(
      "href",
      "/checkout/creator-launch-room-pass",
    );
  });

  it("disables publishing when the price is invalid", async () => {
    const user = userEvent.setup();
    render(<CreateCheckoutForm />);

    const price = screen.getByLabelText("Price");
    await user.clear(price);
    await user.type(price, "0");

    expect(screen.getByRole("button", { name: "Create mock checkout" })).toBeDisabled();
    expect(screen.getByText(/complete the title/i)).toBeInTheDocument();
  });
});