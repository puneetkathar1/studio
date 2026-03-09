'use server';

import { runIngestionAll } from '@/lib/server/ingestion';

const KALSHI_API_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

export interface KalshiEventMeta {
  title: string;
  category: string;
  status: 'open' | 'closed';
}

/**
 * Fetch Kalshi event metadata keyed by event_ticker.
 * Used by admin event-title regeneration.
 */
export async function fetchKalshiEventMetadataMap(targetTickers?: string[]) {
  const out: Record<string, KalshiEventMeta> = {};
  let cursor: string | undefined;
  let page = 0;
  const maxPages = 40;
  const targetSet = new Set((targetTickers || []).filter(Boolean));

  while (page < maxPages) {
    const url = new URL(`${KALSHI_API_BASE}/events`);
    url.searchParams.set('limit', '100');
    url.searchParams.set('with_nested_markets', 'false');
    if (cursor) url.searchParams.set('cursor', cursor);

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json', 'User-Agent': 'StudioAdminAction/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`Kalshi events API returned ${response.status}`);
    }

    const data = await response.json();
    const events = data?.events || [];
    for (const ev of events) {
      if (!ev?.event_ticker) continue;
      const normalizedStatus = String(ev.status || '').toLowerCase();
      out[ev.event_ticker] = {
        title: ev.title || 'Untitled Event',
        category: ev.category || 'General',
        status:
          normalizedStatus === 'open' ||
          normalizedStatus === 'active' ||
          normalizedStatus === 'initialized' ||
          normalizedStatus === 'inactive'
            ? 'open'
            : 'closed',
      };
    }

    cursor = data?.cursor;
    page++;
    if (targetSet.size > 0 && Object.keys(out).length >= targetSet.size) break;
    if (!cursor || events.length === 0) break;
  }

  if (targetSet.size > 0) {
    const filtered: Record<string, KalshiEventMeta> = {};
    for (const ticker of targetSet) {
      if (out[ticker]) filtered[ticker] = out[ticker];
    }
    return { success: true as const, map: filtered, count: Object.keys(filtered).length };
  }

  return { success: true as const, map: out, count: Object.keys(out).length };
}

/**
 * Admin-triggered ingestion entrypoint.
 * Uses internal Next ingestion logic (no Cloud Functions / standalone server).
 */
export async function triggerManualIngestion() {
  try {
    const limit = Number(process.env.INGEST_MARKET_LIMIT || '100');
    const result = await runIngestionAll(Math.max(1, Math.min(limit, 1000)));
    return {
      success: true,
      endpoint: 'next:internal-ingestion',
      message: JSON.stringify({ ok: true, ...result }),
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Unknown ingestion error' };
  }
}

