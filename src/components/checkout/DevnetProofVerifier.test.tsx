import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DevnetProofVerifier } from "./DevnetProofVerifier";

const originalFetch = global.fetch;
const validSignature = "2Ana1pUpv2ZbMVkwF5FXapYeBEjdxDatLn7nvJkhgTSXbs59SyZSx866bXirPgj8QQVB57uxHJBG1YFvkRbFj4T";

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("DevnetProofVerifier", () => {
  it("verifies a devnet signature and shows the explorer link", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        verified: true,
        slot: 123456,
        confirmationStatus: "confirmed",
        explorerUrl: `https://explorer.solana.com/tx/${validSignature}?cluster=devnet`,
      }),
    });

    render(<DevnetProofVerifier />);

    await user.type(screen.getByLabelText("Devnet transaction signature"), validSignature);
    await user.click(screen.getByRole("button", { name: "Verify devnet proof" }));

    await waitFor(() => expect(screen.getByText("Verified on devnet")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: "Open Solana Explorer" })).toHaveAttribute(
      "href",
      `https://explorer.solana.com/tx/${validSignature}?cluster=devnet`,
    );
  });

  it("hides mock signatures from the input", () => {
    render(<DevnetProofVerifier defaultSignature="mock_sig_creator_pass_1001" />);

    expect(screen.getByLabelText("Devnet transaction signature")).toHaveValue("");
  });
});
