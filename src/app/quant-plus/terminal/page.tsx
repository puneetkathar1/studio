'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';
import { Market, GadState, PublicLedgerEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Cpu, 
  Activity, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  Database,
  Maximize2,
  Waves,
  Lock,
  Target,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { useDoc } from '@/firebase/firestore/use-doc';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  lambda: {
    label: 'λ Trace',
    color: 'hsl(var(--quant-primary))',
  },
} satisfies ChartConfig;

function GadStateHud({ marketId }: { marketId: string }) {
  const firestore = useFirestore();
  const stateRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'marketState', marketId) : null,
    [firestore, marketId]
  );
  const { data: state, isLoading } = useDoc<any>(stateRef);

  if (isLoading) return <div className="h-48 animate-pulse bg-white/5 rounded-xl border border-white/5" />;
  if (!state) return null;

  // Adapt to potential nested GAD state from functions
  const gad = state.gad || state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-5 bg-black/40 border border-[hsl(var(--quant-primary)/0.2)] rounded-2xl space-y-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu className="w-12 h-12 text-[hsl(var(--quant-primary))]" /></div>
        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Stress State (λt)</span>
        <div className="text-3xl font-black font-mono text-[hsl(var(--quant-primary))]">{(gad.lambda || 0.1).toFixed(4)}</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[8px] h-4 font-black uppercase border-[hsl(var(--quant-primary)/0.3)] text-[hsl(var(--quant-primary))]">
            Regime: {gad.regime || 'stable'}
          </Badge>
        </div>
      </div>

      <div className="p-5 bg-black/40 border border-[hsl(var(--quant-accent)/0.2)] rounded-2xl space-y-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-12 h-12 text-[hsl(var(--quant-accent))]" /></div>
        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Jump Prob (pt)</span>
        <div className="text-3xl font-black font-mono text-[hsl(var(--quant-accent))]">{(gad.jumpProb || 0.05).toFixed(4)}</div>
        <p className="text-[8px] text-muted-foreground font-bold uppercase italic">Endogenous Discontinuity</p>
      </div>

      <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-12 h-12 text-white" /></div>
        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Latent Variance (vt)</span>
        <div className="text-3xl font-black font-mono text-white">{(gad.v || 0.02).toFixed(4)}</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[8px] h-4 font-black uppercase opacity-40">EWMA Filtered</Badge>
        </div>
      </div>
    </div>
  );
}

function GadDecisionBasis({ marketId }: { marketId: string }) {
  const firestore = useFirestore();
  const signalQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, "signalsIssued"),
      where("marketId", "==", marketId),
      orderBy("updatedAt", "desc"),
      limit(1)
    ) : null,
    [firestore, marketId]
  );
  const { data: signals } = useCollection<any>(signalQuery);
  const signal = signals?.[0];

  if (!signal) return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-30 h-full">
      <Target className="w-8 h-8 mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Decision Logic</span>
    </div>
  );

  return (
    <div className="p-6 bg-black border border-[hsl(var(--quant-primary)/0.3)] rounded-2xl space-y-6 shadow-2xl h-full text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[hsl(var(--quant-primary)/0.1)] rounded text-[hsl(var(--quant-primary))]">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest italic">GAD Decision Basis</h3>
        </div>
        <Badge variant={signal.stance === 'BET' ? 'default' : 'secondary'} className={cn(
          "text-xs font-black px-4",
          signal.stance === 'BET' ? "bg-[hsl(var(--quant-primary))]" : ""
        )}>
          {signal.stance} {signal.direction || ''}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Structural Rationale</span>
          <p className="text-xs italic leading-relaxed text-foreground/90">"{signal.rationaleShort || signal.rationale}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
            <span className="text-[8px] font-black text-muted-foreground uppercase">Risk-Adj Edge</span>
            <div className="text-lg font-black font-mono text-[hsl(var(--quant-primary))]">
              {signal.evEst > 0 ? '+' : ''}{(signal.evEst * 100).toFixed(2)}%
            </div>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
            <span className="text-[8px] font-black text-muted-foreground uppercase">TQS Scalar</span>
            <div className="text-lg font-black font-mono">{(signal.tqs || 0).toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {signal.tags?.map((t: string) => (
            <Badge key={t} variant="outline" className="text-[7px] font-black uppercase opacity-60">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuantPlusTerminalPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const firestore = useFirestore();

  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), orderBy('volume', 'desc'), limit(50)) : null,
    [firestore]
  );
  const { data: markets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(20)) : null,
    [firestore]
  );
  const { data: ledgerEntries } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const selectedMarket = useMemo(() => 
    markets?.find(m => m.id === selectedId) || markets?.[0] || null, 
    [markets, selectedId]
  );

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    if (!selectedMarket) return [];
    const seed = selectedMarket.id.length;
    return Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      lambda: 0.1 + (Math.sin(i * 0.5 + seed + tick * 0.1) * 0.05) + (Math.random() * 0.02)
    }));
  }, [selectedMarket, tick]);

  return (
    <div className="fixed inset-0 bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none z-[100] text-left">
      <TickerTape entries={ledgerEntries || []} />

      <div className="h-12 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" asChild>
            <Link href="/quant-plus"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[hsl(var(--quant-primary))] rounded flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">Q</div>
            <span className="text-xs font-black tracking-tighter uppercase italic">Quant <span className="text-[hsl(var(--quant-primary))]">+</span> Terminal</span>
          </div>
          <div className="h-4 w-px bg-white/5 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))] animate-pulse" />
            <span className="text-[9px] font-black uppercase text-[hsl(var(--quant-primary))] tracking-widest">GAD Engine: FILTERING</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Compute Cycle</span>
            <span className="text-xs font-black font-mono text-[hsl(var(--quant-primary))]">NOMINAL</span>
          </div>
          <div className="h-8 w-px bg-white/5 hidden sm:block" />
          <Lock className="w-4 h-4 text-[hsl(var(--quant-primary))] opacity-40 hidden xs:block" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-white/5 bg-[#080A0F] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[hsl(var(--quant-primary))]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Market Cluster</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-mono opacity-50">ACTIVE: {markets?.length || 0}</Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {isMarketsLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[hsl(var(--quant-primary))] opacity-20" /></div>
              ) : markets?.map(m => (
                <div 
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-l-2 relative group",
                    selectedMarket?.id === m.id ? "bg-[hsl(var(--quant-primary)/0.05)] border-l-[hsl(var(--quant-primary))]" : "hover:bg-white/[0.02] border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-[7px] h-3.5 border-white/10 uppercase opacity-50">{m.venue}</Badge>
                    <span className="text-[8px] font-mono text-muted-foreground">ID_{m.venueMarketId.slice(-6)}</span>
                  </div>
                  <h4 className={cn("text-[11px] font-bold leading-tight line-clamp-2 transition-colors", selectedMarket?.id === m.id ? "text-[hsl(var(--quant-primary))]" : "text-foreground/80 group-hover:text-[hsl(var(--quant-primary))]")}>
                    {m.title}
                  </h4>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 bg-[#05070A] flex flex-col overflow-hidden min-w-0">
          {selectedMarket ? (
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-8">
                <div className="flex flex-col gap-6 border-b border-white/5 pb-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 text-left">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black text-[9px] uppercase px-2 italic">QUANT+ SUBSTRATE</Badge>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-[hsl(var(--quant-primary))]" /> STRUCTURAL DISCONTINUITY AUDIT
                        </span>
                      </div>
                      <h2 className="text-3xl font-black font-headline tracking-tighter italic uppercase text-foreground">
                        {selectedMarket.title}
                      </h2>
                    </div>
                    <Button variant="outline" className="border-white/10 text-[10px] font-black uppercase h-10 gap-2" asChild>
                      <Link href={`/intelligence/${selectedMarket.id}`}>Base Intelligence <Maximize2 className="w-3 h-3" /></Link>
                    </Button>
                  </div>
                </div>

                <GadStateHud marketId={selectedMarket.id} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-card/30 border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-2xl backdrop-blur-xl text-left">
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[hsl(var(--quant-primary)/0.1)] rounded border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest italic">Adaptive Discontinuity Trace</h3>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Structural λt Evolution</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[300px] w-full">
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorLambda" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--quant-primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--quant-primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area 
                              type="monotone" 
                              dataKey="lambda" 
                              stroke="hsl(var(--quant-primary))" 
                              fillOpacity={1} 
                              fill="url(#colorLambda)" 
                              strokeWidth={4}
                              animationDuration={1500}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <GadDecisionBasis marketId={selectedMarket.id} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-4">
              <Waves className="w-16 h-16" />
              <span className="text-xs font-black uppercase tracking-[0.5em]">Synchronizing GAD Matrix...</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-[hsl(var(--quant-primary))]"><Cpu className="w-3.5 h-3.5" /> GAD_ENGINE: RUNNING</div>
          <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> SECURITY: AES-256</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))] animate-ping" />
          <span className="text-[hsl(var(--quant-primary))] opacity-100 uppercase tracking-widest">Structural Pulse: Nominal</span>
        </div>
      </div>
    </div>
  );
}
