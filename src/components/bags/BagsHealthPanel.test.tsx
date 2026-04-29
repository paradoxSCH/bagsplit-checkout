import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BagsHealthPanel } from "./BagsHealthPanel";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("BagsHealthPanel", () => {
  it("shows a connected state when the auth probe succeeds", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ connected: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          connected: true,
          tokenCount: 1,
          sampleTokens: [{ token: "TokenMint111111111111111111111111111111111", symbol: "BAGS", name: "Bags Demo" }],
        }),
      });

    render(<BagsHealthPanel />);

    expect(screen.getByText("Checking")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Connected")).toBeInTheDocument());
    expect(await screen.findByText(/read 1 bags token records/i)).toBeInTheDocument();
    expect(screen.getByText("BAGS")).toBeInTheDocument();
    expect(screen.queryByText(/private-user/i)).not.toBeInTheDocument();
  });

  it("falls back when the auth probe is unavailable", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    render(<BagsHealthPanel />);

    await waitFor(() => expect(screen.getByText("Unavailable")).toBeInTheDocument());
    expect(screen.getByText(/mock checkout data/i)).toBeInTheDocument();
  });
});