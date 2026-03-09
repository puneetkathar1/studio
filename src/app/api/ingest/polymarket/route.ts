import { NextRequest, NextResponse } from "next/server";
import { isIngestAuthorized, parseMarketLimit } from "../_lib";
import { runPolymarketIngestion } from "@/lib/server/ingestion";

export async function POST(req: NextRequest) {
  const route = "/api/ingest/polymarket";
  if (!isIngestAuthorized(req)) {
    console.warn(JSON.stringify({ scope: "ingest.api", route, step: "unauthorized", ts: new Date().toISOString() }));
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const limit = parseMarketLimit(req);
    console.log(JSON.stringify({ scope: "ingest.api", route, step: "start", ts: new Date().toISOString(), limit }));
    const result = await runPolymarketIngestion(limit);
    console.log(JSON.stringify({ scope: "ingest.api", route, step: "success", ts: new Date().toISOString(), result }));
    return NextResponse.json({ ok: true, venue: "polymarket", ...result }, { status: 200 });
  } catch (error: any) {
    console.error(
      JSON.stringify({
        scope: "ingest.api",
        route,
        step: "error",
        ts: new Date().toISOString(),
        message: error?.message || "Unknown error",
      })
    );
    return NextResponse.json(
      { ok: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
