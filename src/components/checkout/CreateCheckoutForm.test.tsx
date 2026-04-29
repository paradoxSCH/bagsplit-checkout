import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CreateCheckoutForm } from "./CreateCheckoutForm";

describe("CreateCheckoutForm", () => {
  it("renders the default BagSplit checkout draft", () => {
    render(<CreateCheckoutForm />);

    expect(screen.getByLabelText("Checkout title")).toHaveValue("Creator Launch Room Pass");
    expect(screen.getByLabelText("Token")).toHaveValue("BSPAY");
    expect(screen.getByRole("button", { name: "Create mock checkout" })).toBeEnabled();
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