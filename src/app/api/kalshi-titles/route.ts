import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Fetching Kalshi event titles...');
    
    const response = await fetch(
      'https://api.kalshi.com/trade-api/v2/events?limit=1000&with_nested_markets=true'
    );
    
    if (!response.ok) {
      throw new Error(`Kalshi API returned ${response.status}`);
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    const tickerToTitle: Record<string, string> = {};
    events.forEach((ev: any) => {
      if (ev.event_ticker && ev.title) {
        tickerToTitle[ev.event_ticker] = ev.title;
      }
    });
    
    console.log(`[API] Fetched ${Object.keys(tickerToTitle).length} event titles`);
    
    return NextResponse.json({
      success: true,
      tickerToTitle,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[API] Error fetching Kalshi events:', message);
    
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
