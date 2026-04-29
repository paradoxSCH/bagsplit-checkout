import { afterEach, describe, expect, it } from "vitest";

import {
  bagsDefaultTokenPlan,
  checkBagsAuth,
  getBagsEcosystemSnapshot,
  getBagsIntegrationStatus,
  getBagsServerEnv,
} from "./bags";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("Bags server integration", () => {
  it("keeps BSPAY as the default assumed token plan", () => {
    expect(bagsDefaultTokenPlan.tokenName).toBe("BagSplit Pay");
    expect(bagsDefaultTokenPlan.ticker).toBe("BSPAY");
    expect(bagsDefaultTokenPlan.status).toBe("default-assumed-available");
  });

  it("detects missing server API key without exposing secrets", () => {
    delete process.env.BAGS_API_KEY;

    const env = getBagsServerEnv();
    const status = getBagsIntegrationStatus();

    expect(env.success).toBe(false);
    expect(status.hasApiKey).toBe(false);
    expect(JSON.stringify(status)).not.toContain("BAGS_API_KEY");
  });

  it("reports configured server status when a key is present", () => {
    process.env.BAGS_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL = "https://api.devnet.solana.com";

    const env = getBagsServerEnv();
    const status = getBagsIntegrationStatus();

    expect(env.success).toBe(true);
    expect(status.hasApiKey).toBe(true);
    expect(status.sdkServices).toContain("auth.me");
  });

  it("checks Bags auth without returning profile details", async () => {
    const status = await checkBagsAuth({
      auth: {
        me: async () => ({ user: { username: "private-user" } }),
      },
    });

    expect(status).toEqual({ checked: true, connected: true });
    expect(JSON.stringify(status)).not.toContain("private-user");
  });

  it("sanitizes Bags auth failures", async () => {
    const status = await checkBagsAuth({
      auth: {
        me: async () => {
          throw new TypeError("secret failure details");
        },
      },
    });

    expect(status).toEqual({ checked: true, connected: false, error: "TypeError" });
    expect(JSON.stringify(status)).not.toContain("secret failure details");
  });

  it("summarizes Bags ecosystem tokens without returning creator profile payloads", async () => {
    const snapshot = await getBagsEcosystemSnapshot({
      state: {
        getTopTokensByLifetimeFees: async () => [
          {
            token: "TokenMint111111111111111111111111111111111",
            lifetimeFees: "42.5",
            tokenInfo: { symbol: "BAGS", name: "Bags Demo", logoURI: "https://example.com/logo.png" },
            creators: [{ username: "private-creator" }],
          },
        ],
      },
    });

    expect(snapshot.connected).toBe(true);
    expect(snapshot.tokenCount).toBe(1);
    expect(snapshot.sampleTokens[0]).toEqual({
      token: "TokenMint111111111111111111111111111111111",
      symbol: "BAGS",
      name: "Bags Demo",
      lifetimeFees: "42.5",
    });
    expect(JSON.stringify(snapshot)).not.toContain("private-creator");
    expect(JSON.stringify(snapshot)).not.toContain("logoURI");
  });

  it("sanitizes Bags ecosystem failures", async () => {
    const snapshot = await getBagsEcosystemSnapshot({
      state: {
        getTopTokensByLifetimeFees: async () => {
          throw new Error("private upstream details");
        },
      },
    });

    expect(snapshot.connected).toBe(false);
    expect(snapshot.error).toBe("Error");
    expect(JSON.stringify(snapshot)).not.toContain("private upstream details");
  });
});