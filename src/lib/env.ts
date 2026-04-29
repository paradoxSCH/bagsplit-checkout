import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Bags Hackathon Starter"),
  NEXT_PUBLIC_SOLANA_NETWORK: z
    .enum(["devnet", "testnet", "mainnet-beta"])
    .default("devnet"),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
});

function normalize(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getEnvStatus() {
  const publicEnv = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: normalize(process.env.NEXT_PUBLIC_APP_NAME) ?? "Bags Hackathon Starter",
    NEXT_PUBLIC_SOLANA_NETWORK: normalize(process.env.NEXT_PUBLIC_SOLANA_NETWORK) ?? "devnet",
    NEXT_PUBLIC_SOLANA_RPC_URL:
      normalize(process.env.NEXT_PUBLIC_SOLANA_RPC_URL) ?? "https://api.devnet.solana.com",
  });

  return {
    hasBagsApiKey: Boolean(normalize(process.env.BAGS_API_KEY)),
    bagsApiBaseUrl:
      normalize(process.env.BAGS_API_BASE_URL) ?? "https://public-api-v2.bags.fm/api/v1",
    publicEnvValid: publicEnv.success,
    publicEnv: publicEnv.success ? publicEnv.data : null,
    publicEnvIssues: publicEnv.success ? [] : publicEnv.error.issues,
  };
}