'use client';

import { useMemo } from 'react';
import { Market, PublicLedgerEntry, MarketState, MarketTick } from '@/lib/types';
import { useCountdown } from '@/hooks/use-countdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  BrainCircuit, 
  Waves,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Target,
  Scale,
  Radar,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, Timestamp } from 'firebase/firestore';
import { getEffectiveStance } from '@/lib/intelligence';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar as RadarNode,
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { IntelligenceScorecard } from '@/app/markets/intelligence-dialog';
import { AnalysisDialog } from '@/app/markets/analysis-dialog';

const chartConfig = {
  price: {
    label: 'Market Price',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

function VenueIcon({ venue }: { venue: string }) {
  const isPoly = venue.toLowerCase() === 'polymarket';
  return (
    <div className={cn(
      "relative flex aspect-square w-7 h-7 items-center justify-center rounded border font-black shrink-0 transition-all",
      isPoly ? "border-primary/30 bg-primary/10 text-primary" : "border-blue-500/30 bg-blue-500/10 text-blue-400"
    )}>
      {isPoly ? 'P' : 'K'}
      <span className={cn(
        "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full animate-pulse",
        isPoly 
          ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" 
          : "bg-accent shadow-[0_0_8px_hsl(var(--accent))]"
      )} />
    </div>
  );
}

export function HeroMarket({ market }: { market: Market }) {
  const firestore = useFirestore();
  const closeDate = useMemo(() => {
    if (!market.closeTime) return null;
    return market.closeTime.toDate ? market.closeTime.toDate() : new Date(market.closeTime);
  }, [market.closeTime]);
  const countdownText = useCountdown(closeDate);

  const signalQuery = useMemoFirebase(
    () => (firestore ? query(
      collection(firestore, 'publicLedger'), 
      where('marketId', '==', market.id), 
      orderBy('tsIssued', 'desc'), 
      limit(1)
    ) : null),
    [firestore, market.id]
  );
  const { data: signals } = useCollection<PublicLedgerEntry>(signalQuery);
  const ledgerSignal = signals?.[0];

  const stateRef = useMemoFirebase(
    () => (firestore && market.id ? doc(firestore, 'marketState', market.id) : null),
    [firestore, market.id]
  );
  const { data: marketState } = useDoc<MarketState>(stateRef);

  const ticksQuery = useMemoFirebase(
    () => (firestore && market.id ? query(
      collection(firestore, 'marketTicks'),
      where('marketId', '==', market.id),
      orderBy('ts', 'asc'),
      limit(30)
    ) : null),
    [firestore, market.id]
  );
  const { data: ticks } = useCollection<MarketTick>(ticksQuery);

  const chartData = useMemo(() => {
    if (ticks && ticks.length > 0) {
      return ticks.map(t => ({
        time: t.ts instanceof Timestamp ? t.ts.toDate().getTime() : new Date(t.ts).getTime(),
        price: t.priceProb * 100
      }));
    }

    const currentPrice = (market.priceProb || 0.5) * 100;
    const seed = market.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
    
    return Array.from({ length: 20 }).map((_, i) => {
      const time = Date.now() - (20 - i) * 60000;
      const drift = Math.sin(i * 0.5 + seed) * 2.5 + Math.cos(i * 0.2) * 1.5;
      const synthPrice = Math.max(5, Math.min(95, currentPrice + drift));
      return {
        time,
        price: synthPrice
      };
    });
  }, [ticks, market.priceProb, market.id]);

  const intel = useMemo(() => getEffectiveStance(market, ledgerSignal, marketState), [market, ledgerSignal, marketState]);

  const radarData = useMemo(() => [
    { subject: 'SPS', A: Math.min(100, (intel.cvs || 70) * 0.9) },
    { subject: 'CCI', A: Math.min(100, (intel.tqs || 0.015) * 4000) },
    { subject: 'EVS', A: Math.min(100, (intel.ev || 0.05) * 800) },
    { subject: 'MIS', A: 85 },
    { subject: 'LQS', A: 75 },
    { subject: 'TVS', A: 90 },
  ], [intel]);

  const convictionPercent = Math.min(100, (intel.tqs / 0.02) * 100);

  return (
    <div className="w-full bg-[#0A0C12] border border-primary/20 rounded-xl overflow-hidden shadow-2xl group">
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 gap-4">
        <div className="flex-1 min-w-0 flex gap-3 items-start">
          <VenueIcon venue={market.venue} />
          <div className="space-y-1">
            <h2 className="text-lg lg:text-2xl font-black font-headline tracking-tighter leading-none uppercase italic text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {market.title}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-black text-[8px] uppercase px-2 py-0.5 tracking-[0.1em]">
                Intelligence Focus
              </Badge>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-2.5 h-2.5 text-accent" />
                <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-60 font-black tracking-widest">
                  NODE_{(market.venueMarketId || market.id).toUpperCase().slice(-6)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 ml-auto">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black font-mono text-foreground uppercase opacity-40 mb-0.5 tracking-widest">Conviction</span>
            <div className="flex flex-col items-center gap-0.5">
              <span className={cn("text-sm font-black font-mono leading-none", convictionPercent >= 100 ? "text-accent" : "text-primary")}>
                {convictionPercent.toFixed(1)}%
              </span>
              <div className="w-16 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", convictionPercent >= 100 ? "bg-accent" : "bg-primary")} style={{ width: `${convictionPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black font-mono text-foreground uppercase opacity-40 mb-0.5 tracking-widest">Horizon</span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground tabular-nums uppercase leading-none">{countdownText || "SYNC..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <IntelligenceScorecard market={market} />
            <AnalysisDialog market={market} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 p-4 border-r border-white/5 bg-white/[0.01] space-y-4 flex flex-col justify-center h-[160px]">
          <div className="space-y-0.5 text-left">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">TQS SCALAR</span>
            <div className="text-2xl font-black font-mono tracking-tighter text-accent tabular-nums">
              {intel.tqs.toFixed(4)}
            </div>
            <p className="text-[7px] font-bold text-accent/60 uppercase tracking-tighter italic">Floor: 0.020 θ_bet</p>
          </div>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Whale Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", intel.whaleRisk === 'high' ? "bg-destructive animate-pulse shadow-[0_0_8px_hsl(var(--destructive))]" : intel.whaleRisk === 'med' ? "bg-yellow-500" : "bg-accent")} />
              <span className="text-[9px] font-black uppercase">{intel.whaleRisk?.toUpperCase() || 'LOW'}</span>
            </div>
            <Badge variant="outline" className={cn(
              "text-[7px] font-black uppercase px-1.5 py-0",
              intel.moveType === 'mechanical' ? "text-destructive border-destructive/30 bg-destructive/5" : "text-primary border-primary/30 bg-primary/5"
            )}>
              {intel.moveType?.toUpperCase() || 'INFORMATIONAL'}
            </Badge>
          </div>
        </div>

        <div className="md:col-span-6 border-r border-white/5 bg-black/20 relative h-[160px]">
          <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5 opacity-40">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Discovery Path Trace</span>
          </div>
          <div className="w-full h-full p-2">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Area type="step" dataKey="price" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col items-center justify-center bg-white/[0.01] gap-2 relative overflow-hidden h-[160px]">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <BrainCircuit className="w-20 h-20 text-primary" />
          </div>
          <div className="h-[110px] w-full relative z-10 p-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: 'bold' }} />
                <RadarNode name="Intel" dataKey="A" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between w-full px-3 items-end absolute bottom-2 left-0 z-20">
            <div className="flex flex-col text-left">
              <span className="text-[7px] font-black uppercase text-muted-foreground tracking-widest">Stance</span>
              <Badge variant={intel.stance === 'BET' ? 'default' : 'secondary'} className="text-[8px] font-black uppercase px-1.5 py-0">
                {intel.stance} {intel.direction || ''}
              </Badge>
            </div>
            <Button size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 px-3 bg-primary hover:bg-primary/90" asChild>
              <Link href={`/intelligence/${market.id}`}>
                Full Audit <History className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
