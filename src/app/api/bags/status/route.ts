import { NextResponse } from "next/server";

import { getBagsIntegrationStatus } from "@/lib/bags";

export function GET() {
  return NextResponse.json({
    ok: true,
    ...getBagsIntegrationStatus(),
  });
}