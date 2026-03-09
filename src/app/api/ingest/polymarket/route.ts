import { NextRequest, NextResponse } from "next/server";
import { isIngestAuthorized, parseMarketLimit } from "../_lib";
import { runPolymarketIngestion } from "@/lib/server/ingestion";

export async function POST(req: NextRequest) {
  if (!isIngestAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const limit = parseMarketLimit(req);
    const result = await runPolymarketIngestion(limit);
    return NextResponse.json({ ok: true, venue: "polymarket", ...result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
