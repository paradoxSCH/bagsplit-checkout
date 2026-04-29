import { NextResponse } from "next/server";

import { createCheckoutInputSchema, listCheckoutItems, saveMockCheckout } from "@/lib/checkout";

export function GET() {
  return NextResponse.json({ checkouts: listCheckoutItems() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createCheckoutInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout input", issues: parsed.error.issues }, { status: 400 });
  }

  return NextResponse.json({ checkout: saveMockCheckout(parsed.data) }, { status: 201 });
}