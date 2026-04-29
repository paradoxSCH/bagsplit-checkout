import { NextResponse } from "next/server";

import { getBagsEcosystemSnapshot, getBagsServerEnv } from "@/lib/bags";

export async function GET() {
  const env = getBagsServerEnv();

  if (!env.success) {
    return NextResponse.json(
      {
        ok: false,
        checked: false,
        connected: false,
        tokenCount: 0,
        sampleTokens: [],
        error: "Bags server environment is not configured.",
      },
      { status: 503 },
    );
  }

  const result = await getBagsEcosystemSnapshot();

  return NextResponse.json({
    ok: result.connected,
    ...result,
  });
}