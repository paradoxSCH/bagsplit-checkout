import { NextResponse } from "next/server";

import { resetMockData } from "@/lib/checkout";

export async function POST() {
  return NextResponse.json({ ok: true, ...resetMockData() });
}