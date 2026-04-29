import { NextResponse } from "next/server";

import { createOrderInputSchema, listOrders, saveMockOrder } from "@/lib/checkout";

export function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order input", issues: parsed.error.issues }, { status: 400 });
  }

  return NextResponse.json({ order: saveMockOrder(parsed.data) }, { status: 201 });
}