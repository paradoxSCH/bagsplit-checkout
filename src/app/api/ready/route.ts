import { NextResponse } from "next/server";

import { getBagsIntegrationStatus } from "@/lib/bags";
import { getEnvStatus } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    ...getEnvStatus(),
    bags: getBagsIntegrationStatus(),
  });
}