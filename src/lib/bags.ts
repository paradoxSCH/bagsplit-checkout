import { Connection } from "@solana/web3.js";
import { BagsSDK } from "@bagsfm/bags-sdk";
import { z } from "zod";

const bagsServerEnvSchema = z.object({
  BAGS_API_KEY: z.string().min(1),
  BAGS_API_BASE_URL: z.string().url().default("https://public-api-v2.bags.fm/api/v1"),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().default("https://api.devnet.solana.com"),
});

export const bagsDefaultTokenPlan = {
  projectName: "BagSplit Checkout",
  tokenName: "BagSplit Pay",
  ticker: "BSPAY",
  status: "default-assumed-available",
  note:
    "Solana token tickers are not globally unique. Treat BSPAY as the working default until final Bags launch checks are complete.",
};

export function getBagsServerEnv() {
  return bagsServerEnvSchema.safeParse({
    BAGS_API_KEY: process.env.BAGS_API_KEY,
    BAGS_API_BASE_URL: process.env.BAGS_API_BASE_URL ?? "https://public-api-v2.bags.fm/api/v1",
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  });
}

export function getBagsIntegrationStatus() {
  const env = getBagsServerEnv();

  return {
    hasApiKey: env.success,
    apiBaseUrl: env.success ? env.data.BAGS_API_BASE_URL : "https://public-api-v2.bags.fm/api/v1",
    rpcUrlConfigured: env.success,
    tokenPlan: bagsDefaultTokenPlan,
    sdkServices: [
      "auth.me",
      "state.getTokenCreators",
      "state.getTokenLifetimeFees",
      "state.getTopTokensByLifetimeFees",
      "trade.getQuote",
    ],
  };
}

type BagsAuthClient = {
  auth: {
    me: () => Promise<unknown>;
  };
};

export async function checkBagsAuth(client: BagsAuthClient = createBagsSdk()) {
  try {
    await client.auth.me();

    return {
      checked: true,
      connected: true,
    };
  } catch (error) {
    return {
      checked: true,
      connected: false,
      error: error instanceof Error ? error.name : "BagsAuthError",
    };
  }
}

export function createBagsSdk() {
  const env = getBagsServerEnv();

  if (!env.success) {
    throw new Error("Bags server environment is not configured.");
  }

  const connection = new Connection(env.data.NEXT_PUBLIC_SOLANA_RPC_URL, "processed");
  return new BagsSDK(env.data.BAGS_API_KEY, connection, "processed");
}