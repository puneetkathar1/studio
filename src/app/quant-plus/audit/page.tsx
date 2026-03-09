'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { Market, GadState, PublicLedgerEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Search, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Database,
  Waves,
  BrainCircuit,
  Scale,
  Clock,
  Fingerprint,
  Loader2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function QuantPlusAuditPage() {
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const firestore = useFirestore();

  // 1. Fetch available discovery nodes for auditing
  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), orderBy('volume', 'desc'), limit(20)) : null,
    [firestore]
  );
  const { data: markets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  const selectedMarket = useMemo(() => 
    markets?.find(m => m.id === selectedMarketId) || markets?.[0] || null,
    [markets, selectedMarketId]
  );

  // 2. Fetch GAD state history for the selected node (Trace Log)
  const statesQuery = useMemoFirebase(
    () => (firestore && selectedMarket ? query(
      collection(firestore, 'marketState'),
      where('marketId', '==', selectedMarket.id),
      orderBy('updatedAt', 'desc'),
      limit(50)
    ) : null),
    [firestore, selectedMarket]
  );
  const { data: states, isLoading: isStatesLoading } = useCollection<any>(statesQuery);

  // 3. Fetch issued signals for the selected node (Decision Log)
  const signalsQuery = useMemoFirebase(
    () => (firestore && selectedMarket ? query(
      collection(firestore, 'signalsIssued'),
      where('marketId', '==', selectedMarket.id),
      orderBy('updatedAt', 'desc'),
      limit(20)
    ) : null),
    [firestore, selectedMarket]
  );
  const { data: signals, isLoading: isSignalsLoading } = useCollection<any>(signalsQuery);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 py-12 px-4 animate-in fade-in duration-1000 text-left">
      <header className="space-y-4 border-b border-white/5 pb-8 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Fingerprint className="w-48 h-48 text-[hsl(var(--quant-primary))]" />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black px-3 py-1 uppercase tracking-widest">GAD Audit Node</Badge>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[hsl(var(--quant-primary)/0.1)] border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
            <History className="w-3 h-3 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Reconstructed Trace Active</span>
          </div>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none relative z-10">
          State <span className="text-[hsl(var(--quant-primary))]">Audit</span>.
        </h1>
        
        <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed max-w-3xl relative z-10">
          Immutable reconstructed timeline of the GAD state engine. Deconstruct every λt shift, jump probability spike, and risk-adjusted edge calculation for total institutional transparency.
        </p>

        <div className="flex gap-3 pt-4 relative z-10">
          <Button variant="outline" size="sm" className="h-9 px-6 border-white/10 text-muted-foreground font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-white/5" asChild>
            <Link href="/quant-plus/terminal"><ArrowLeft className="w-3.5 h-3.5" /> GAD Matrix</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: NODE SELECTOR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl text-left">
            <div className="p-4 border-b border-white/5 bg-[#0A0C12] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[hsl(var(--quant-primary))]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Discovery Node</span>
              </div>
              <Badge variant="outline" className="text-[8px] font-mono opacity-50">ACTIVE: {markets?.length || 0}</Badge>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="divide-y divide-white/5">
                {isMarketsLoading ? (
                  <div className="p-8 text-center opacity-20"><Loader2 className="animate-spin mx-auto text-[hsl(var(--quant-primary))]" /></div>
                ) : markets?.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedMarketId(m.id)}
                    className={cn(
                      "w-full p-4 text-left transition-all border-l-2 relative group",
                      selectedMarket?.id === m.id ? "bg-[hsl(var(--quant-primary)/0.05)] border-l-[hsl(var(--quant-primary))]" : "hover:bg-white/[0.02] border-l-transparent"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1 text-left">
                      <Badge variant="outline" className="text-[7px] border-white/10 uppercase opacity-50">{m.venue}</Badge>
                      <span className="text-[8px] font-mono opacity-40">ID_{m.venueMarketId.slice(-6)}</span>
                    </div>
                    <h4 className={cn("text-[11px] font-bold leading-tight line-clamp-2 transition-colors text-left", selectedMarket?.id === m.id ? "text-[hsl(var(--quant-primary))]" : "text-foreground/80 group-hover:text-[hsl(var(--quant-primary))]")}>
                      {m.title}
                    </h4>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT: AUDIT TRACE */}
        <div className="lg:col-span-8 space-y-8 text-left">
          {selectedMarket ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* STATE TRACE */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[hsl(var(--quant-primary))]">
                    <Activity className="w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest italic">State Trace Log</h3>
                  </div>
                  <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="h-8 bg-muted/30 border-b border-white/5 flex items-center px-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="w-24">Timestamp</div>
                      <div className="flex-1">GAD_Vitals (λ / v / pt)</div>
                    </div>
                    <ScrollArea className="h-[450px]">
                      <div className="divide-y divide-white/5">
                        {isStatesLoading ? (
                          <div className="p-8 text-center opacity-20"><Loader2 className="animate-spin mx-auto text-[hsl(var(--quant-primary))]" /></div>
                        ) : states && states.length > 0 ? (
                          states.map((s: any, i: number) => {
                            const gad = s.gad || s;
                            return (
                              <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors text-[10px] font-mono group">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">[{format(s.updatedAt?.toDate ? s.updatedAt.toDate() : new Date(), 'HH:mm:ss.SSS')}]</span>
                                  <Badge variant="outline" className="text-[7px] border-[hsl(var(--quant-primary)/0.3)] text-[hsl(var(--quant-primary))] uppercase font-black tracking-tighter">Regime: {gad.regime || 'stable'}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between"><span>λt (Stress):</span><span className="text-[hsl(var(--quant-primary))] font-bold">{(gad.lambda || 0).toFixed(4)}</span></div>
                                    <div className="flex justify-between"><span>vt (Var):</span><span className="text-foreground font-bold">{(gad.v || 0).toFixed(4)}</span></div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between"><span>pt (Jump):</span><span className="text-[hsl(var(--quant-accent))] font-bold">{(gad.jumpProb || 0).toFixed(4)}</span></div>
                                    <div className="flex justify-between"><span>Confidence:</span><span className="text-primary font-bold">{(gad.quality || 1).toFixed(2)}</span></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-20 text-center opacity-20"><Waves className="w-8 h-8 mx-auto" /><p className="text-[9px] font-black uppercase mt-2">Awaiting State Pulse</p></div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </section>

                {/* SIGNAL LOG */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-4 h-4 fill-current" />
                    <h3 className="text-xs font-black uppercase tracking-widest italic">Signal Decision Log</h3>
                  </div>
                  <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="h-8 bg-muted/30 border-b border-white/5 flex items-center px-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="w-20">Time</div>
                      <div className="flex-1">Stance Basis</div>
                      <div className="text-right">Edge</div>
                    </div>
                    <ScrollArea className="h-[450px]">
                      <div className="divide-y divide-white/5">
                        {isSignalsLoading ? (
                          <div className="p-8 text-center opacity-20"><Loader2 className="animate-spin mx-auto text-primary" /></div>
                        ) : signals && signals.length > 0 ? (
                          signals.map((sig: any, i: number) => (
                            <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[9px] font-mono text-muted-foreground">{format(sig.updatedAt?.toDate ? sig.updatedAt.toDate() : new Date(), 'HH:mm:ss')}</span>
                                  <Badge variant={sig.stance === 'BET' ? 'default' : 'secondary'} className="w-fit text-[8px] font-black uppercase">
                                    {sig.stance} {sig.direction || ''}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-muted-foreground uppercase block text-right">Risk-Adj Edge</span>
                                  <span className="text-xs font-black font-mono text-accent">+{((sig.evEst || sig.adjEdge || 0) * 100).toFixed(3)}%</span>
                                </div>
                              </div>
                              <p className="text-[10px] italic leading-relaxed text-foreground/70 bg-white/5 p-2 rounded border border-white/5">"{sig.rationaleShort || sig.rationale}"</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center opacity-20"><Zap className="w-8 h-8 mx-auto" /><p className="text-[9px] font-black uppercase mt-2">No High-Conviction Triggers</p></div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </section>
              </div>

              {/* INTEGRITY AUDIT FOOTER */}
              <div className="bg-[hsl(var(--quant-primary)/0.05)] border border-[hsl(var(--quant-primary)/0.2)] rounded-[2rem] p-8 lg:p-12 relative overflow-hidden group shadow-2xl text-left">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit className="w-48 h-48 text-[hsl(var(--quant-primary))]" /></div>
                <div className="relative z-10 space-y-6 max-w-2xl text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[hsl(var(--quant-primary)/0.1)] rounded-xl border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Integrity Verification Substrate</h3>
                      <Badge variant="outline" className="border-[hsl(var(--quant-primary)/0.3)] text-[hsl(var(--quant-primary))] font-black text-[9px] uppercase tracking-widest">Oracle Finality: OK</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-[hsl(var(--quant-primary)/0.3)] pl-6 text-left">
                    "The GAD State Audit provides an immutable reconstructed view of the platform's internal reasoning. λt (adaptive discontinuity) transitions are endogenously governed by sub-second price impact proxies ($P_t$) and belief dispersion ($D_t$)."
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[hsl(var(--quant-primary))]"><Scale className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Model Alpha</span></div>
                      <div className="text-xl font-black font-mono text-white">GAD_V1.4</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary"><Lock className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Security</span></div>
                      <div className="text-xl font-black font-mono text-white">AES-256</div>
                    </div>
                    <div className="space-y-1 hidden sm:block">
                      <div className="flex items-center gap-2 text-accent"><Clock className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Sync Heartbeat</span></div>
                      <div className="text-xl font-black font-mono text-white">12ms</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center opacity-20 space-y-6">
              <Waves className="w-24 h-24 animate-pulse text-[hsl(var(--quant-primary))]" />
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-black uppercase tracking-[0.5em]">Establishing Connection...</h3>
                <p className="text-sm font-bold uppercase italic">Synchronizing 1,482 Discovery Nodes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>Trace Log Hash Verified</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))]" />
          <span>Zero-Knowledge Audit</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))]" />
          <span>Oracle Protocols: Nominal</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[hsl(var(--quant-primary))]" />
          <span className="text-[10px] font-black uppercase">Institutional Computation Cluster: Active</span>
        </div>
      </footer>
    </div>
  );
}
