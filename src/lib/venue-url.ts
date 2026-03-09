export function buildVenueUrl(input: {
  venue?: string | null;
  venueMarketId?: string | null;
  venueUrl?: string | null;
}): string {
  const venue = String(input.venue || "").toLowerCase();
  const venueMarketId = String(input.venueMarketId || "").trim();
  const explicitUrl = String(input.venueUrl || "").trim();

  if (/^https?:\/\//i.test(explicitUrl)) {
    maybeLogVenueUrl({ ...input, resolvedUrl: explicitUrl, strategy: "explicit" });
    return explicitUrl;
  }

  if (venue === "polymarket") {
    if (/^\d+$/.test(venueMarketId)) {
      const resolvedUrl = `https://polymarket.com/market/${venueMarketId}`;
      maybeLogVenueUrl({ ...input, resolvedUrl, strategy: "polymarket_market" });
      return resolvedUrl;
    }
    const resolvedUrl = `https://polymarket.com/event/${venueMarketId}`;
    maybeLogVenueUrl({ ...input, resolvedUrl, strategy: "polymarket_event" });
    return resolvedUrl;
  }

  if (venue === "kalshi") {
    const resolvedUrl = `https://kalshi.com/markets/${venueMarketId}`;
    maybeLogVenueUrl({ ...input, resolvedUrl, strategy: "kalshi_market" });
    return resolvedUrl;
  }

  maybeLogVenueUrl({ ...input, resolvedUrl: "#", strategy: "fallback_hash" });
  return "#";
}

function maybeLogVenueUrl(payload: Record<string, unknown>) {
  const browserFlag =
    typeof window !== "undefined" &&
    (window as any)?.localStorage?.getItem("DEBUG_VENUE_URLS") === "1";
  const serverFlag = typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_VENUE_URLS === "1";
  if (!browserFlag && !serverFlag) return;

  console.log(
    JSON.stringify({
      scope: "venue.url",
      ts: new Date().toISOString(),
      ...payload,
    })
  );
}
