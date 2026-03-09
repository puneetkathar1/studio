import { NextRequest } from "next/server";

export function isIngestAuthorized(req: NextRequest): boolean {
  const required = process.env.INGEST_API_TOKEN || "";
  if (!required) return true;
  const provided = req.headers.get("x-ingest-token") || "";
  return provided === required;
}

export function parseMarketLimit(req: NextRequest): number {
  const queryLimit = Number(req.nextUrl.searchParams.get("limit") || "");
  const envLimit = Number(process.env.INGEST_MARKET_LIMIT || "100");
  const base = Number.isFinite(queryLimit) && queryLimit > 0 ? queryLimit : envLimit;
  return Math.max(1, Math.min(base, 1000));
}
