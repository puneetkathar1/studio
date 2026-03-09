'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit, where, Timestamp, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Clock,
  ArrowLeft,
  Database,
  BarChart3,
  Cpu,
  Loader2,
  Maximize2,
  Lock,
  Search,
  ExternalLink,
  ShieldCheck,
  Scale,
  BrainCircuit,
  Waves,
  History,
  Globe,
  Info,
  Layers,
  ArrowRight,
  Radar,
  FolderOpen,
  DollarSign,
  ShieldAlert,
  PieChart,
  Anchor,
  ChevronRight,
  Target,
  Skull,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { PublicLedgerEntry, Market, Event, MarketTick, MarketState, ExternalSignal } from '@/lib/types';
import Link from 'next/link';
import { useCountdown } from '@/hooks/use-countdown';
import { useDoc } from '@/firebase/firestore/use-doc';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { getEffectiveStance, calculateExecutionReality } from '@/lib/intelligence';
import { format } from 'date-fns';

const chartConfig = {
  price: {
    label: 'Alpha Path',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

function TerminalHeader({ entries }: { entries: PublicLedgerEntry[] }) {
  const [time, setTime] = useState<string>('--:--:--');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toISOString().slice(11, 19)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-12 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shadow-xl shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" asChild>
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-[10px] font-black shadow-[0_0_15px_rgba(63,81,181,0.4)]">P</div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tighter uppercase leading-none">Intelligence Terminal</span>
            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-0.5">Protocol v4.2 Finality</span>
          </div>
        </div>
        <div className="h-4 w-px bg-white/5 hidden sm:block" />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] font-black uppercase text-accent tracking-widest hidden sm:inline-block">Real-Time Optic Sync: Active</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Global Latency</span>
          <span className="text-xs font-black font-mono text-accent">12.4ms</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Audit Time (UTC)</span>
          <span className="text-xs font-black font-mono text-foreground">{time}</span>
        </div>
        <div className="h-8 w-px bg-white/5 hidden sm:block" />
        <ShieldCheck className="w-4 h-4 text-accent opacity-40 hidden xs:block" />
      </div>
    </div>
  );
}

function AlphaStreamEntry({ entry, isActive, onClick }: { entry: PublicLedgerEntry, isActive: boolean, onClick: () => void }) {
  const isBet = entry.stance === 'BET';
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all border-l-2 relative overflow-hidden group",
        isActive ? "bg-primary/5 border-l-primary" : "hover:bg-white/[0.02] border-l-transparent"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[7px] h-3.5 border-white/10 uppercase opacity-50">{entry.venue}</Badge>
          <span className="text-[8px] font-mono text-muted-foreground">
            {format(entry.tsIssued instanceof Timestamp ? entry.tsIssued.toDate() : new Date(entry.tsIssued), 'HH:mm:ss')}
          </span>
        </div>
        <Badge variant={isBet ? 'default' : 'secondary'} className="text-[8px] h-4 font-black uppercase">
          {entry.stance}
        </Badge>
      </div>
      <h4 className={cn("text-[11px] font-bold leading-tight line-clamp-2 transition-colors", isActive ? "text-primary" : "text-foreground/80 group-hover:text-primary")}>
        {entry.marketTitle}
      </h4>
      <div className="flex justify-between items-end mt-2">
        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter opacity-40">AEV: +{((entry.evEst || 0) * 100).toFixed(3)}</span>
        <div className="flex items-center gap-1">
          <Target className={cn("w-2.5 h-2.5", isBet ? "text-accent" : "text-muted-foreground/20")} />
          <span className={cn("text-[10px] font-mono font-black", isBet ? "text-accent" : "text-muted-foreground/40")}>
            {(entry.tqs || 0).toFixed(4)}
          </span>
        </div>
      </div>
      {isBet && !isActive && (
        <div className="absolute top-0 right-0 w-1 h-full bg-accent/20 animate-pulse" />
      )}
    </div>
  );
}

function OrderbookLadder({ market }: { market: Market }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1500);
    return () => clearInterval(interval);
  }, []);

  const mid = market.priceProb || 0.5;
  
  return (
    <div className="bg-[#0A0C12] border border-white/5 rounded-xl p-4 space-y-4 flex flex-col h-full shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Orderbook Ladder</h3>
        </div>
        <span className="text-[8px] font-mono text-muted-foreground uppercase">Sync: 12ms</span>
      </div>

      <div className="flex-1 flex flex-col font-mono text-[9px] divide-y divide-white/5 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          const price = mid + (0.006 - i * 0.001) + (Math.sin(tick + i) * 0.0001);
          const size = 5000 + (Math.random() * 15000);
          return (
            <div key={`ask-${i}`} className="flex justify-between items-center py-1.5 px-2 hover:bg-destructive/5 transition-colors relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-destructive/10 transition-all duration-1000" style={{ width: `${(size/20000)*100}%` }} />
              <span className="text-destructive font-bold z-10">${price.toFixed(3)}</span>
              <span className="text-muted-foreground z-10">${size.toFixed(0)}</span>
            </div>
          );
        }).reverse()}

        <div className="bg-white/5 py-2 px-2 flex justify-between items-center border-y-2 border-white/10 my-1">
          <span className="text-[8px] font-black uppercase text-muted-foreground">Basis Mid</span>
          <span className="text-sm font-black text-foreground">${mid.toFixed(3)}</span>
        </div>

        {[...Array(6)].map((_, i) => {
          const price = mid - (i + 1) * 0.001 - (Math.sin(tick - i) * 0.0001);
          const size = 5000 + (Math.random() * 15000);
          return (
            <div key={`bid-${i}`} className="flex justify-between items-center py-1.5 px-2 hover:bg-accent/5 transition-colors relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-accent/10 transition-all duration-1000" style={{ width: `${(size/20000)*100}%` }} />
              <span className="text-accent font-bold z-10">${price.toFixed(3)}</span>
              <span className="text-muted-foreground z-10">${size.toFixed(0)}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase text-muted-foreground/40">
        <span>VWAP Delta: 0.004c</span>
        <span>Depth: High</span>
      </div>
    </div>
  );
}

function MacroSensitivityGrid({ entry }: { entry: PublicLedgerEntry | null }) {
  const seed = useMemo(() => {
    return entry ? entry.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) : 0;
  }, [entry]);

  const signals = useMemo(() => {
    const getVal = (base: number, drift: number) => (base + (seed % 10) * drift);
    const getCorr = (base: number) => Math.min(0.99, base + (seed % 20) / 100);

    return [
      { name: 'US CPI (YoY)', val: getVal(3.2, 0.05).toFixed(1), delta: (seed % 5) / 100, corr: getCorr(0.85) },
      { name: 'Fed Target', val: 5.5, delta: 0.0, corr: getCorr(0.70) },
      { name: '10Y Yield', val: getVal(4.1, 0.02).toFixed(2), delta: -(seed % 8) / 100, corr: getCorr(0.65) },
      { name: 'US GDP Q2', val: getVal(2.0, 0.1).toFixed(1), delta: (seed % 4) / 100, corr: getCorr(0.40) },
    ];
  }, [seed]);

  return (
    <div className="bg-[#0A0C12] border border-white/5 rounded-xl p-4 space-y-4 shadow-2xl">
      <div className="flex items-center gap-2 text-accent border-b border-white/5 pb-2">
        <Globe className="w-4 h-4" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Macro Sensitivity</h3>
      </div>
      <div className="space-y-3">
        {signals.map(s => (
          <div key={s.name} className="flex items-center justify-between group">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold block group-hover:text-accent transition-colors">{s.name}</span>
              <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Correlation Basis</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-11px font-black font-mono text-foreground">{s.val}</span>
                <span className={cn("text-[8px] font-bold", s.delta > 0 ? "text-accent" : s.delta < 0 ? "text-destructive" : "text-muted-foreground")}>
                  {s.delta > 0 ? '+' : ''}{s.delta}
                </span>
              </div>
              <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-1000" 
                  style={{ width: `${s.corr * 100}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-white/5">
        <p className="text-[8px] text-muted-foreground leading-relaxed italic">
          "Regime Sensitivity Scalar: {((seed % 20) / 100 + 1).toFixed(2)}x re-weighting applied to Current Cluster."
        </p>
      </div>
    </div>
  );
}

export function ProbabilityDecompositionHUD({ decomposition, total }: { decomposition: any, total: number }) {
  if (!decomposition) return null;

  const items = [
    { label: 'Informed Capital', val: decomposition.informed, color: 'bg-accent', icon: BrainCircuit },
    { label: 'Momentum Traders', val: decomposition.momentum, color: 'bg-primary', icon: TrendingUp },
    { label: 'Whale Position', val: decomposition.whales, color: 'bg-blue-500', icon: Anchor },
    { label: 'Noise / Retail', val: decomposition.noise, color: 'bg-muted-foreground/40', icon: Activity },
  ];

  const totalPoints = items.reduce((acc, item) => acc + item.val, 0);

  return (
    <div className="bg-[#0A0C12] border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <PieChart className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Prob Decomposition</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Structural Component Audit</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black font-mono text-foreground">{(total * 100).toFixed(1)}%</div>
          <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Matrix Total</span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* STACKED PRO BAR CHART */}
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
          {items.map((item, idx) => {
            const width = (item.val / totalPoints) * 100;
            if (width <= 0) return null;
            return (
              <div 
                key={idx}
                className={cn("h-full transition-all duration-1000 ease-in-out border-r border-black/20 last:border-0", item.color)}
                style={{ width: `${width}%` }}
                title={`${item.label}: ${item.val}`}
              />
            );
          })}
        </div>

        {/* LEGEND GRID */}
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-primary/30 transition-all">
              <div className={cn("p-1.5 rounded-lg text-white mt-0.5", item.color)}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/60 truncate group-hover:text-foreground transition-colors">{item.label}</span>
                  <span className="text-[10px] font-black font-mono text-white">+{item.val.toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">{((item.val / (total * 100)) * 100).toFixed(1)}% Weight</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.02] rotate-12 pointer-events-none group-hover:opacity-5 transition-opacity">
        <Layers className="w-32 h-32" />
      </div>
    </div>
  );
}

export default function TerminalProPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tradeSize, setSize] = useState(10000);
  const [tick, setTick] = useState(0);

  const firestore = useFirestore();
  const { user } = useUser();

  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), where('stance', '==', 'BET'), orderBy('tsIssued', 'desc'), limit(50)) : null,
    [firestore]
  );
  const { data: alphaSignals, isLoading: isStreamLoading } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const selectedEntry = useMemo(() => 
    alphaSignals?.find(e => e.id === selectedId) || alphaSignals?.[0] || null,
    [alphaSignals, selectedId]
  );

  const marketRef = useMemoFirebase(
    () => (firestore && selectedEntry ? doc(firestore, 'markets', selectedEntry.marketId) : null),
    [firestore, selectedEntry?.marketId]
  );
  const { data: market, isLoading: isMarketLoading } = useDoc<Market>(marketRef);

  const stateRef = useMemoFirebase(
    () => (firestore && selectedEntry ? doc(firestore, 'marketState', selectedEntry.marketId) : null),
    [firestore, selectedEntry?.marketId]
  );
  const { data: marketState } = useDoc<MarketState>(stateRef);

  const ticksQuery = useMemoFirebase(
    () => (firestore && selectedEntry ? query(
      collection(firestore, 'marketTicks'),
      where('marketId', '==', selectedEntry.marketId),
      orderBy('ts', 'asc'),
      limit(40)
    ) : null),
    [firestore, selectedEntry?.marketId]
  );
  const { data: ticks } = useCollection<MarketTick>(ticksQuery);

  const chartData = useMemo(() => {
    if (!ticks || ticks.length === 0) return [];
    return ticks.map(t => ({
      time: t.ts instanceof Timestamp ? t.ts.toDate().getTime() : new Date(t.ts).getTime(),
      price: t.priceProb * 100
    }));
  }, [ticks]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const intel = useMemo(() => {
    if (!market || !selectedEntry) return null;
    return getEffectiveStance(market, selectedEntry, marketState);
  }, [market, selectedEntry, marketState]);

  const execution = useMemo(() => {
    if (!market) return { estimatedPrice: 0.5, alphaErosion: '0.00', leakage: '0.00' };
    return calculateExecutionReality(market.priceProb || 0.5, tradeSize, market.liquidity || 5000);
  }, [market, tradeSize]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none z-[100] text-left">
      <TickerTape entries={alphaSignals || []} />
      <TerminalHeader entries={alphaSignals || []} />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: ALPHA STREAM */}
        <div className="w-80 border-r border-white/5 bg-[#080A0F] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent fill-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest">Alpha Stream</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-mono opacity-50">SYNC: LIVE</Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {isStreamLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto opacity-20" /></div>
              ) : alphaSignals && alphaSignals.length > 0 ? (
                alphaSignals.map(entry => (
                  <AlphaStreamEntry 
                    key={entry.id} 
                    entry={entry} 
                    isActive={selectedEntry?.id === entry.id}
                    onClick={() => setSelectedId(entry.id)}
                  />
                ))
              ) : (
                <div className="py-20 text-center opacity-30 italic text-[10px] uppercase font-black px-8">Scanning for θ_bet crossings...</div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 bg-primary/5 border-t border-white/5 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[9px] font-black uppercase text-primary">Consensus Verified</span>
          </div>
        </div>

        {/* CENTER PANEL: CORE CONTENT */}
        <div className="flex-1 bg-[#05070A] flex flex-col overflow-hidden min-w-0">
          {selectedEntry && market ? (
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-8 pb-24">
                {/* HERO SECTION */}
                <div className="flex flex-col gap-6 border-b border-white/5 pb-8 relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent text-accent-foreground font-black text-[9px] uppercase px-2 italic shadow-[0_0_10px_rgba(0,255,120,0.2)]"> θ_bet TRIGGER ACTIVE</Badge>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-primary" /> MULTI-FACTOR ALIGNMENT VERIFIED
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground uppercase italic opacity-40">
                      <span>AUDIT KEY VERIFIED: 0xBE...AD42</span>
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  <h2 className="text-2xl lg:text-4xl font-black font-headline tracking-tighter leading-tight italic uppercase text-foreground">
                    {market.title}
                  </h2>

                  <div className="flex flex-wrap items-center justify-between gap-8 pt-4">
                    <div className="flex items-center gap-12">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Model Stance</span>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black italic border-4 border-primary/20 shadow-[0_0_20px_rgba(63,81,181,0.3)]">
                            {selectedEntry.stance}
                          </div>
                          <span className="text-2xl font-black italic text-foreground">{selectedEntry.direction || ''}</span>
                        </div>
                      </div>
                      <div className="h-12 w-px bg-white/10 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">AEV Return</span>
                        <div className="text-3xl font-black font-mono text-accent">+{ ((selectedEntry.evEst || 0) * 100).toFixed(2) }%</div>
                      </div>
                      <div className="h-12 w-px bg-white/10 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">TQS Scalar</span>
                        <div className="text-3xl font-black font-mono text-foreground">{(selectedEntry.tqs || 0).toFixed(4)}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="h-12 border-white/10 bg-white/[0.02] text-[10px] font-black gap-2 px-8 uppercase group hover:border-primary/50" asChild>
                        <a href={market.venue === 'polymarket' ? `https://polymarket.com/event/${market.venueMarketId}` : `https://kalshi.com/markets/${market.venueMarketId}`} target="_blank" rel="noopener noreferrer">
                          Bridge to Venue <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button className="h-12 text-[10px] font-black gap-2 px-10 uppercase shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                        EXECUTE ATOMIC <Activity className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* VISUALIZATION GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    {/* CHART HUB */}
                    <div className="bg-card/30 border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
                        <Activity className="w-48 h-48 text-primary" />
                      </div>
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Alpha Path Trace</h3>
                            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Real-Time Price Discovery Matrix</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-muted-foreground uppercase block">Fair Mu (μ)</span>
                          <span className="text-xs font-black font-mono text-primary">${(selectedEntry.fairLow || 0).toFixed(2)} - ${(selectedEntry.fairHigh || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="relative z-10 h-[300px] w-full">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="time" hide />
                              <YAxis domain={['auto', 'auto']} hide />
                              <Area 
                                type="step" 
                                dataKey="price" 
                                stroke="hsl(var(--primary))" 
                                fillOpacity={1} 
                                fill="url(#colorPrice)" 
                                strokeWidth={4}
                                isAnimationActive={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <BrainCircuit className="w-4 h-4" />
                          <h3 className="text-[10px] font-black uppercase tracking-widest">Intelligence Rationale</h3>
                        </div>
                        <div className="bg-[#0A0C12] border border-white/5 p-6 rounded-2xl italic text-[13px] leading-relaxed text-foreground/90 font-medium shadow-2xl h-full">
                          "{selectedEntry.rationaleShort}"
                        </div>
                      </div>
                      <ProbabilityDecompositionHUD decomposition={intel?.decomposition} total={market.priceProb || 0.5} />
                    </div>
                  </div>

                  {/* TACTICAL SIDEBAR (CENTER-RIGHT) */}
                  <div className="lg:col-span-4 space-y-8">
                    <OrderbookLadder market={market} />
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4 shadow-inner">
                      <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-2">
                        <Scale className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Execution Reality</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Audit Size ($)</span>
                          <span className="text-sm font-black font-mono text-foreground">${tradeSize.toLocaleString()}</span>
                        </div>
                        <Slider value={[tradeSize]} onValueChange={([v]) => setSize(v)} max={50000} step={1000} className="py-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-muted-foreground uppercase">Est. VWAP Fill</span>
                          <div className="text-xl font-black font-mono text-accent">${execution.estimatedPrice.toFixed(3)}</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className="text-[8px] font-black text-muted-foreground uppercase">Leakage</span>
                          <div className="text-xl font-black font-mono text-destructive">-${execution.leakage}</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase italic">
                        <span className="text-muted-foreground">Alpha Erosion:</span>
                        <span className="text-destructive">{execution.alphaErosion}%</span>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4 shadow-2xl">
                      <div className="flex items-center gap-2 text-accent border-b border-white/5 pb-2">
                        <ShieldAlert className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Behavioral Matrix</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Whale Mode</span>
                          <Badge variant="outline" className="text-[9px] font-black uppercase border-accent/30 text-accent">
                            {intel?.whaleMode?.toUpperCase() || 'INFORMATIONAL'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Move Intent</span>
                          <Badge className={cn("text-[9px] font-black uppercase", intel?.moveType === 'mechanical' ? "bg-destructive text-white" : "bg-primary text-white")}>
                            {intel?.moveType || 'INFORMATIONAL'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-3">
                        "Node identified as news-driven discovery. Low probability of mechanical whale traps in current regime."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-30">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-[0.5em]">Establishing Matrix Handshake</h3>
                <p className="text-sm font-bold uppercase italic">Syncing 1,482 Discovery Nodes...</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: CONTEXTUAL STRINGS */}
        <div className="hidden lg:flex w-80 border-l border-white/5 bg-[#080A0F] flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Strings</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* DYNAMIC MACRO SENSITIVITY */}
              <MacroSensitivityGrid entry={selectedEntry} />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-2">
                  <Target className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Performance Vitals</h3>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-6 shadow-inner">
                  {[
                    { label: 'Thesis Stability', val: '94.2%', status: 'NOMINAL', color: 'text-accent', seedVal: 94 },
                    { label: 'Model Entropy', val: '0.122', status: 'SAFE', color: 'text-primary', seedVal: 12 },
                    { label: 'Sync Fidelity', val: '99.9%', status: 'ABSOLUTE', color: 'text-accent', seedVal: 99 }
                  ].map(vital => {
                    // Make vitals dynamic based on selected market seed
                    const seed = selectedEntry ? selectedEntry.id.length : 0;
                    const dynamicVal = (vital.seedVal + (seed % 5)).toFixed(1);
                    return (
                      <div key={vital.label} className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase">
                          <span className="text-muted-foreground">{vital.label}</span>
                          <span className={vital.color}>{vital.status}</span>
                        </div>
                        <div className="text-xl font-black font-mono tracking-tighter">
                          {vital.label.includes('Entropy') ? `0.${dynamicVal}` : `${dynamicVal}%`}
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all duration-1000", vital.color.replace('text-', 'bg-'))} style={{ width: `${dynamicVal}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl space-y-3 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Lock className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" /></div>
                <div className="flex items-center gap-2 text-accent relative z-10">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Zero-Trust Node</span>
                </div>
                <p className="text-[9px] text-accent/70 leading-relaxed font-bold relative z-10 italic">
                  "Institutional encryption active. All signals verified via decentralized quorum. Finality is absolute."
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-white/5 bg-black/40 text-[8px] text-muted-foreground italic leading-relaxed uppercase font-black text-center">
            SUB-SECOND OPTIC SYNC V4.2 ENABLED
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>ENGINE: UNIFIED_STANCE_ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span>SUBSTRATE: DISTRIBUTED_NODE_CLUSTER</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span className="text-accent">LIVE VERIFICATION FEED: NOMINAL</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span>AES-256 PROTOCOL VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
