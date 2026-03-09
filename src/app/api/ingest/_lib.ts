import { NextRequest } from "next/server";

export function isIngestAuthorized(req: NextRequest): boolean {
  const required = process.env.INGEST_API_TOKEN || "";
  if (!required) return true;
  const provided = req.headers.get("x-ingest-token") || "";
  const ok = provided === required;
  if (!ok) {
    console.warn(
      JSON.stringify({
        scope: "ingest.api",
        route: req.nextUrl.pathname,
        step: "auth.failed",
        ts: new Date().toISOString(),
      })
    );
  }
  return ok;
}

export function parseMarketLimit(req: NextRequest): number {
  const queryLimit = Number(req.nextUrl.searchParams.get("limit") || "");
  const envLimit = Number(process.env.INGEST_MARKET_LIMIT || "100");
  const base = Number.isFinite(queryLimit) && queryLimit > 0 ? queryLimit : envLimit;
  const parsed = Math.max(1, Math.min(base, 1000));
  console.log(
    JSON.stringify({
      scope: "ingest.api",
      route: req.nextUrl.pathname,
      step: "limit.parsed",
      ts: new Date().toISOString(),
      queryLimit,
      envLimit,
      parsed,
    })
  );
  return parsed;
}
