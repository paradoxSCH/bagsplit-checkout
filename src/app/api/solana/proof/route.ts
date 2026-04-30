import { NextResponse } from "next/server";

import { verifyDevnetTransactionProof, verifySolanaProofInputSchema } from "@/lib/solana";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = verifySolanaProofInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        checked: false,
        verified: false,
        network: "devnet",
        error: "Invalid Solana transaction signature.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const result = await verifyDevnetTransactionProof(parsed.data.signature);

  return NextResponse.json(
    {
      ok: result.verified,
      ...result,
    },
    { status: result.verified ? 200 : 404 },
  );
}
