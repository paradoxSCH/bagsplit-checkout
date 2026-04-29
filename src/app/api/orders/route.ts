import { NextResponse } from "next/server";

import { demoOrders } from "@/lib/checkout";

export function GET() {
  return NextResponse.json({ orders: demoOrders });
}