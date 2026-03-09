import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/firebase/admin";

const KALSHI_API_BASE = "https://api.elections.kalshi.com/trade-api/v2";
const POLYMARKET_GAMMA_URL = "https://gamma-api.polymarket.com/events";

type Venue = "kalshi" | "polymarket";

type IngestionResult = {
  fetched: number;
  successful: number;
  failed: number;
  uniqueEvents: number;
  closedStale: number;
};

type IngestionAllResult = {
  kalshi: IngestionResult;
  polymarket: IngestionResult;
  totals: {
    fetched: number;
    successful: number;
    failed: number;
    closedStale: number;
  };
};

type NormalizedMarket = {
  venue: Venue;
  venueMarketId: string;
  title: string;
  category: string;
  status: "open" | "closed";
  openTime: Date;
  closeTime: Date;
  volume: number;
  liquidity: number;
  priceProb: number;
  searchText: string;
  event: {
    id: string;
    venueEventId: string;
    title: string;
    category: string;
    status: "open" | "closed";
    volume: number;
    liquidity: number;
  };
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function mapKalshiStatus(status?: string): "open" | "closed" {
  const s = String(status || "").toLowerCase();
  return s === "active" || s === "open" || s === "initialized" || s === "inactive" ? "open" : "closed";
}

function isKalshiTradable(status?: string): boolean {
  return mapKalshiStatus(status) === "open";
}

function parseIsoDate(value: unknown, fallback: Date): Date {
  const str = String(value || "");
  if (!str) return fallback;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return fallback;
  return d;
}

function resolveKalshiTitle(market: any): string {
  const title = String(market?.title || "").trim();
  if (title) return title;
  return "Untitled Market";
}

async function fetchKalshiMarkets(limitMarkets = 100): Promise<NormalizedMarket[]> {
  const url = new URL(`${KALSHI_API_BASE}/events`);
  url.searchParams.set("limit", "100");
  url.searchParams.set("with_nested_markets", "true");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "NextIngestion/1.0" },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`Kalshi events API failed: ${response.status}`);
  }

  const data = await response.json();
  const events = Array.isArray(data?.events) ? data.events : [];
  const dedup = new Map<string, NormalizedMarket>();

  for (const event of events) {
    const eventTicker = String(event?.event_ticker || "");
    if (!eventTicker) continue;

    const eventTitle = String(event?.title || "Untitled Event");
    const eventCategory = String(event?.category || "General");
    const eventStatus = mapKalshiStatus(event?.status);
    const eventId = `kalshi_ev_${eventTicker}`;
    const nestedMarkets = Array.isArray(event?.markets) ? event.markets : [];

    for (const market of nestedMarkets) {
      const ticker = String(market?.ticker || "");
      if (!ticker || !isKalshiTradable(market?.status)) continue;

      const marketTitle = resolveKalshiTitle(market);
      const status = mapKalshiStatus(market?.status);
      const volume = toNumber(market?.volume_24h, toNumber(market?.volume, 0));
      const liquidity = toNumber(market?.open_interest, 0);
      const priceProb =
        typeof market?.last_price_dollars === "string"
          ? toNumber(market.last_price_dollars, 0.5)
          : toNumber(market?.last_price, 50) / 100;
      const openTime = parseIsoDate(market?.open_time, new Date());
      const closeTime = parseIsoDate(market?.close_time || market?.expiration_time, new Date(Date.now() + 86400000));

      const normalized: NormalizedMarket = {
        venue: "kalshi",
        venueMarketId: ticker,
        title: marketTitle,
        category: eventCategory,
        status,
        openTime,
        closeTime,
        volume: toNumber(market?.volume, volume),
        liquidity,
        priceProb: Number.isFinite(priceProb) ? priceProb : 0.5,
        searchText: `${marketTitle} ${ticker} ${market?.yes_sub_title || ""}`.toLowerCase(),
        event: {
          id: eventId,
          venueEventId: eventTicker,
          title: eventTitle,
          category: eventCategory,
          status: eventStatus,
          volume: toNumber(event?.volume, 0),
          liquidity: toNumber(event?.liquidity, 0),
        },
      };

      const existing = dedup.get(ticker);
      if (!existing || normalized.volume > existing.volume) {
        dedup.set(ticker, normalized);
      }
    }
  }

  return Array.from(dedup.values())
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limitMarkets);
}

function resolvePolymarketTitle(market: any, event: any): string {
  const eventTitle = String(event?.title || "Untitled Event");
  const groupItemTitle = String(market?.groupItemTitle || "").trim();
  if (groupItemTitle) return groupItemTitle.toLowerCase().includes(eventTitle.toLowerCase()) ? groupItemTitle : `${eventTitle}: ${groupItemTitle}`;
  const question = String(market?.question || "").trim();
  if (question) return question;
  return eventTitle;
}

async function fetchPolymarketMarkets(limitMarkets = 100): Promise<NormalizedMarket[]> {
  const url = new URL(POLYMARKET_GAMMA_URL);
  url.searchParams.set("limit", "100");
  url.searchParams.set("offset", "0");
  url.searchParams.set("order", "volume");
  url.searchParams.set("ascending", "false");
  url.searchParams.set("active", "true");
  url.searchParams.set("closed", "false");
  url.searchParams.set("archived", "false");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "NextIngestion/1.0" },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`Polymarket events API failed: ${response.status}`);
  }

  const events = await response.json();
  const dedup = new Map<string, NormalizedMarket>();

  for (const event of Array.isArray(events) ? events : []) {
    const eventId = String(event?.id || "");
    if (!eventId) continue;
    const eventTitle = String(event?.title || "Untitled Event");
    const eventCategory = String(event?.tags?.[0]?.label || event?.category || "General");
    const eventStatus = event?.closed ? "closed" : "open";
    const eventMarkets = Array.isArray(event?.markets) ? event.markets : [];

    for (const market of eventMarkets) {
      if (!market?.active || market?.closed) continue;
      const venueMarketId = String(market?.slug || market?.id || "");
      if (!venueMarketId) continue;

      const title = resolvePolymarketTitle(market, event);
      const volume = toNumber(market?.volumeNum, toNumber(market?.volume, 0));
      const liquidity = toNumber(market?.liquidityNum, toNumber(market?.liquidity, 0));
      let outcomePrices: any = market?.outcomePrices;
      if (typeof market?.outcomePrices === "string") {
        try {
          outcomePrices = JSON.parse(market.outcomePrices || "[]");
        } catch {
          outcomePrices = [];
        }
      }
      const priceProb = toNumber(outcomePrices?.[0], toNumber(market?.price, 0.5));

      const normalized: NormalizedMarket = {
        venue: "polymarket",
        venueMarketId,
        title,
        category: eventCategory,
        status: "open",
        openTime: parseIsoDate(market?.creation_timestamp, new Date()),
        closeTime: parseIsoDate(market?.end_timestamp || event?.endDate, new Date(Date.now() + 86400000)),
        volume,
        liquidity,
        priceProb: Number.isFinite(priceProb) ? priceProb : 0.5,
        searchText: `${title} ${venueMarketId} ${eventTitle}`.toLowerCase(),
        event: {
          id: eventId,
          venueEventId: eventId,
          title: eventTitle,
          category: eventCategory,
          status: eventStatus,
          volume: toNumber(event?.volume, 0),
          liquidity: toNumber(event?.liquidity, 0),
        },
      };

      const existing = dedup.get(venueMarketId);
      if (!existing || normalized.volume > existing.volume) {
        dedup.set(venueMarketId, normalized);
      }
    }
  }

  return Array.from(dedup.values())
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limitMarkets);
}

async function closeStaleOpenMarkets(venue: Venue, keepMarketDocIds: Set<string>): Promise<number> {
  const db = getDb();
  const snapshot = await db.collection("markets").where("venue", "==", venue).where("status", "==", "open").get();
  let closed = 0;
  let batch = db.batch();
  let ops = 0;

  for (const docSnap of snapshot.docs) {
    if (keepMarketDocIds.has(docSnap.id)) continue;
    batch.set(docSnap.ref, { status: "closed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    closed++;
    ops++;
    if (ops >= 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
  }
  return closed;
}

async function ingestVenueMarkets(venue: Venue, markets: NormalizedMarket[]): Promise<IngestionResult> {
  const db = getDb();
  const keepIds = new Set<string>();
  const eventSeen = new Set<string>();
  let batch = db.batch();
  let ops = 0;
  let successful = 0;
  let failed = 0;

  for (const market of markets) {
    try {
      const marketId = `${venue}_${market.venueMarketId}`;
      keepIds.add(marketId);
      eventSeen.add(market.event.id);

      const eventRef = db.collection("events").doc(market.event.id);
      batch.set(
        eventRef,
        {
          id: market.event.id,
          venue,
          venueEventId: market.event.venueEventId,
          title: market.event.title,
          category: market.event.category,
          status: market.event.status,
          volume: market.event.volume,
          liquidity: market.event.liquidity,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      ops++;

      const marketRef = db.collection("markets").doc(marketId);
      batch.set(
        marketRef,
        {
          id: marketId,
          venue,
          venueMarketId: market.venueMarketId,
          eventId: market.event.id,
          title: market.title,
          category: market.category,
          outcomeType: "binary",
          openTime: market.openTime,
          closeTime: market.closeTime,
          resolutionTime: null,
          resolvedOutcome: null,
          status: market.status,
          volume: market.volume,
          liquidity: market.liquidity,
          priceProb: market.priceProb,
          searchText: market.searchText,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      ops++;
      successful++;

      if (ops >= 400) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    } catch {
      failed++;
    }
  }

  if (ops > 0) {
    await batch.commit();
  }

  const closedStale = await closeStaleOpenMarkets(venue, keepIds);
  return {
    fetched: markets.length,
    successful,
    failed: failed + Math.max(markets.length - successful - failed, 0),
    uniqueEvents: eventSeen.size,
    closedStale,
  };
}

export async function runKalshiIngestion(limitMarkets = 100): Promise<IngestionResult> {
  const markets = await fetchKalshiMarkets(limitMarkets);
  return ingestVenueMarkets("kalshi", markets);
}

export async function runPolymarketIngestion(limitMarkets = 100): Promise<IngestionResult> {
  const markets = await fetchPolymarketMarkets(limitMarkets);
  return ingestVenueMarkets("polymarket", markets);
}

export async function runIngestionAll(limitMarketsPerVenue = 100): Promise<IngestionAllResult> {
  const [kalshi, polymarket] = await Promise.all([
    runKalshiIngestion(limitMarketsPerVenue),
    runPolymarketIngestion(limitMarketsPerVenue),
  ]);

  return {
    kalshi,
    polymarket,
    totals: {
      fetched: kalshi.fetched + polymarket.fetched,
      successful: kalshi.successful + polymarket.successful,
      failed: kalshi.failed + polymarket.failed,
      closedStale: kalshi.closedStale + polymarket.closedStale,
    },
  };
}
