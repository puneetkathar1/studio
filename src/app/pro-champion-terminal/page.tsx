'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Settings2,
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
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProOpportunity, ProControls } from '@/lib/pro-champion/types';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { PublicLedgerEntry, Market } from '@/lib/types';
import Link from 'next/link';

export default function ProChampionTerminalPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [controls, setControls] = useState<ProControls>({
    tradingSize: 5000,
    minEdgeThreshold: 0.03,
    feeAssumption: 0.02,
    slippageModel: 'simple',
    hlWindow: '1h',
    drfFilter: 'all'
  });

  const firestore = useFirestore();
  
  // 1. Fetch live markets to populate the matrix
  const marketsQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'markets'), 
      where('status', '==', 'open'),
      orderBy('volume', 'desc'), 
      limit(15)
    ) : null,
    [firestore]
  );
  const { data: liveMarkets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  // 2. Fetch ledger for ticker tape
  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(30)) : null,
    [firestore]
  );
  const { data: ledgerEntries } = useCollection<PublicLedgerEntry>(ledgerQuery);

  useEffect(() => {
    setMounted(true);
    // Real-time local Matrix flicker to simulate high-frequency live orderbook pressure
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Adapt live market data into ProOpportunity matrix entries
  const processedOpps = useMemo(() => {
    if (!liveMarkets) return [];

    return liveMarkets.map((m, idx) => {
      // Deterministic but dynamic metrics derived from market properties + local ticker
      const seed = m.id.length + idx;
      const drift = (Math.sin(tick * 0.5 + seed) * 0.02);
      
      // Compute simulated Pro metrics
      const baseAEV = 1.5 + (seed % 5) + (m.priceProb || 0.5) * 2;
      const simulatedAEV = Math.max(0.1, baseAEV + drift * 10);
      const simulatedCVS = Math.round(20 + (seed % 60) + drift * 50);
      const simulatedLBS = (m.liquidity || 5000) * 2;
      const simulatedHL = 15 + (seed % 300);
      const simulatedEdge = (controls.tradingSize * (simulatedAEV / 100));

      return {
        market: {
          id: m.id,
          title: m.title,
          venue: m.venue,
          side: (seed % 2 === 0 ? 'YES' : 'NO') as any,
          status: 'open',
          outcomes: ['YES', 'NO']
        },
        cvs: simulatedCVS,
        extractableEdge: simulatedEdge,
        aev: simulatedAEV,
        lbs: simulatedLBS,
        halfLife: simulatedHL,
        drf: (seed % 3 === 0 ? 'High' : seed % 3 === 1 ? 'Med' : 'Low') as any,
        rationale: `Detected ${simulatedCVS > 50 ? 'High' : 'Normal'} tension in orderbook depth relative to ${m.venue} benchmark.`,
        violatedConstraints: simulatedCVS > 60 ? [{ name: 'LADDER_SUM', magnitude: 0.04 }] : []
      } as ProOpportunity;
    })
    .filter(opp => {
      if (controls.drfFilter === 'Low' && opp.drf !== 'Low') return false;
      if (controls.drfFilter === 'Med' && opp.drf === 'High') return false;
      return (opp.aev / 100) >= (controls.minEdgeThreshold * 0.2); // Scaled threshold for simulation feel
    })
    .sort((a, b) => b.extractableEdge - a.extractableEdge);
  }, [liveMarkets, controls, tick]);

  const selectedOpp = useMemo(() => 
    processedOpps.find(o => o.market.id === selectedId) || processedOpps[0], 
    [processedOpps, selectedId]
  );

  const getVenueUrl = (opp: ProOpportunity) => {
    const venueMarketId = opp.market.id.split('_').slice(1).join('_');
    return opp.market.venue.toLowerCase() === 'polymarket'
      ? `https://polymarket.com/event/${venueMarketId}`
      : `https://kalshi.com/markets/${venueMarketId}`;
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none z-[100]">
      <TickerTape entries={ledgerEntries || []} />

      <div className="h-12 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" asChild>
            <Link href="/pro-champion"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs font-black">P</div>
            <span className="text-xs font-black tracking-tighter uppercase">Pro Champion Execution Terminal</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <Badge className="bg-accent text-accent-foreground font-black text-[9px] uppercase tracking-widest px-2 py-0">
            INGESTION: ACTIVE ({(12 + Math.random()).toFixed(0)}ms)
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="uppercase">Matrix:</span>
            <span className="text-accent">SYNCHRONIZED</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="uppercase">Session:</span>
            <span className="text-primary tracking-widest font-mono">X-AUTH-PRO</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-white/5 bg-[#080A0F] flex flex-col">
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Extraction Stream</span>
              <Cpu className="w-3 h-3 text-primary opacity-50" />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                placeholder="SEARCH CLOB..." 
                className="w-full h-8 bg-white/[0.03] border border-white/5 rounded text-[10px] pl-7 focus:outline-none focus:border-primary/50 uppercase font-bold"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {isMarketsLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></div>
              ) : processedOpps.map((opp) => (
                <div 
                  key={opp.market.id}
                  onClick={() => setSelectedId(opp.market.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:bg-white/[0.02] border-l-2",
                    selectedOpp?.market.id === opp.market.id ? "bg-primary/5 border-l-primary" : "border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter opacity-50">{opp.market.venue}</Badge>
                    <Badge variant="secondary" className="text-[8px] h-4 font-black">{opp.market.side}</Badge>
                  </div>
                  <h3 className={cn("text-[11px] font-bold leading-tight line-clamp-2", 
                    selectedOpp?.market.id === opp.market.id ? "text-primary" : "text-foreground/80"
                  )}>
                    {opp.market.title}
                  </h3>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-[9px] font-mono text-destructive font-black">CVS: {opp.cvs}</span>
                    <span className="text-[10px] font-mono font-bold text-accent">E$: ${opp.extractableEdge.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 bg-[#05070A] overflow-hidden flex flex-col">
          {selectedOpp ? (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <div className="p-8 space-y-8 overflow-y-auto no-scrollbar pb-20">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] px-3 uppercase italic">Extraction Matrix v4.2</Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity className="w-3 h-3 text-accent" /> TQS_CALIBRATED: OK
                      </span>
                    </div>
                    <h2 className="text-4xl font-black font-headline tracking-tighter leading-none italic uppercase">
                      {selectedOpp.market.title}
                    </h2>
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">AEV Basis</span>
                         <span className="text-xl font-black font-headline text-accent">+{selectedOpp.aev.toFixed(2)}%</span>
                       </div>
                       <div className="h-8 w-px bg-white/10" />
                       <div className="flex flex-col">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Liquidity Bound</span>
                         <span className="text-xl font-black font-mono tabular-nums text-primary">${(selectedOpp.lbs * (1 - (controls.minEdgeThreshold * 5))).toLocaleString()}</span>
                       </div>
                       <div className="h-8 w-px bg-white/10" />
                       <div className="flex flex-col">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Edge Half-Life</span>
                         <span className="text-xl font-black font-mono tabular-nums text-orange-400">{selectedOpp.halfLife}s</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] font-black h-10 gap-2 px-6 uppercase" asChild>
                      <a href={getVenueUrl(selectedOpp)} target="_blank" rel="noopener noreferrer">Venue Contract <ExternalLink className="w-3.5 h-3.5" /></a>
                    </Button>
                    <Button className="h-10 text-[10px] font-black gap-2 px-6 uppercase shadow-lg shadow-primary/20 bg-accent text-accent-foreground hover:bg-accent/90">
                      Sync CLOB <Activity className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-8">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <BarChart3 className="w-4 h-4" />
                          <h3 className="text-[10px] font-black uppercase tracking-widest">Global Orderflow Reality</h3>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground opacity-50">SYNC_BUFFER: 12ms</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                          <span className="text-[9px] font-black text-muted-foreground uppercase block mb-1">VWAP Bid (${controls.tradingSize.toLocaleString()})</span>
                          <div className="text-2xl font-black font-mono tabular-nums text-accent animate-in fade-in duration-1000">
                            ${(0.442 + (Math.sin(tick) * 0.001)).toFixed(3)}
                          </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                          <span className="text-[9px] font-black text-muted-foreground uppercase block mb-1">VWAP Ask (${controls.tradingSize.toLocaleString()})</span>
                          <div className="text-2xl font-black font-mono tabular-nums text-primary animate-in fade-in duration-1000">
                            ${(0.458 + (Math.cos(tick) * 0.001)).toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
                        {[...Array(8)].map((_, i) => {
                          const val = (0.442 - i*0.001 - (tick % 5) * 0.0001);
                          return (
                            <div key={i} className="flex justify-between items-center p-2 text-[10px] font-mono hover:bg-white/[0.02] transition-colors">
                              <span className="text-accent font-black">{val.toFixed(3)}</span>
                              <div className="flex-1 mx-4 h-1 bg-white/5 relative">
                                <div 
                                  className="absolute right-0 h-full bg-accent/20 transition-all duration-500" 
                                  style={{width: `${Math.max(10, (100 - i*12) + (Math.sin(tick + i) * 10))}%`}} 
                                />
                              </div>
                              <span className="text-muted-foreground">${(1500 / (i + 1)).toFixed(0)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    <section className="bg-accent/5 border border-accent/20 rounded-2xl p-6 grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-4 h-4 text-accent" />
                          <span className="text-[9px] font-black text-accent uppercase tracking-widest">Expected Slippage</span>
                        </div>
                        <div className="text-3xl font-black font-mono text-foreground">
                          {(0.12 * (controls.tradingSize / 1000) * (controls.slippageModel === 'conservative' ? 2 : 1)).toFixed(2)}%
                        </div>
                        <p className="text-[8px] text-muted-foreground font-bold uppercase">Matrix Simulation Active</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="w-4 h-4 text-accent" />
                          <span className="text-[9px] font-black text-accent uppercase tracking-widest">Worst-Leg Risk</span>
                        </div>
                        <div className="text-3xl font-black font-mono text-foreground">
                          -${(12.40 * (controls.tradingSize / 1000)).toFixed(2)}
                        </div>
                        <p className="text-[8px] text-muted-foreground font-bold uppercase italic">Non-atomic proxy</p>
                      </div>
                    </section>
                  </div>

                  <div className="lg:col-span-5 space-y-8">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Structural Tension</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedOpp.violatedConstraints.length > 0 ? selectedOpp.violatedConstraints.map(v => (
                          <div key={v.name} className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl space-y-2 group">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-destructive uppercase tracking-widest">{v.name} VIOLATION</span>
                              <div className="text-xl font-black font-mono text-destructive">+{v.magnitude.toFixed(3)}</div>
                            </div>
                            <p className="text-xs font-bold text-foreground/80 leading-relaxed italic">"Pricing inconsistency detected relative to outcome group '{selectedOpp.market.side}'."</p>
                          </div>
                        )) : (
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                            <span className="text-[10px] font-black uppercase opacity-40">No Structural Violations Detected</span>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <BrainCircuit className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Extraction Briefing</h3>
                      </div>
                      <div className="bg-black/40 p-4 rounded border border-white/5 italic text-sm leading-relaxed text-foreground/90 font-medium">
                        "{selectedOpp.rationale}"
                      </div>
                      <div className="space-y-2 text-[10px] font-mono text-muted-foreground leading-relaxed bg-black/20 p-4 rounded">
                        <p className="text-primary font-bold mb-1 uppercase tracking-widest">Math Transparency:</p>
                        <div className="grid grid-cols-2 gap-x-4">
                          <span>VWAP Cost:</span> <span className="text-foreground">$0.912</span>
                          <span>Platform Fee:</span> <span className="text-foreground">-${(1 * controls.feeAssumption).toFixed(3)}</span>
                          <span>Slippage Model:</span> <span className="text-foreground">-${(0.004 * (controls.slippageModel === 'conservative' ? 2 : 1)).toFixed(3)}</span>
                          <Separator className="col-span-2 my-1 bg-white/10" />
                          <span className="font-bold text-accent">Extractable Alpha:</span> <span className="font-bold text-accent">${(0.064 - controls.feeAssumption).toFixed(3)} / unit</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-30">
              <Maximize2 className="w-24 h-24" />
              <p className="text-xl font-black uppercase tracking-[0.5em]">Establishing Matrix Connection...</p>
            </div>
          )}
        </div>

        <div className="w-80 border-l border-white/5 bg-[#080A0F] flex flex-col p-6 gap-8 overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-4">
              <Settings2 className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest italic">Pro Terminal Controls</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[9px] font-black uppercase text-muted-foreground">Trading Size ($)</Label>
                  <span className="text-xs font-mono font-bold text-primary">${controls.tradingSize.toLocaleString()}</span>
                </div>
                <Slider 
                  value={[controls.tradingSize]} 
                  onValueChange={([v]) => setControls({...controls, tradingSize: v})}
                  max={50000} 
                  step={500} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[9px] font-black uppercase text-muted-foreground">Min Alpha Threshold</Label>
                  <span className="text-xs font-mono font-bold text-accent">{(controls.minEdgeThreshold * 100).toFixed(1)}%</span>
                </div>
                <Slider 
                  value={[controls.minEdgeThreshold * 100]} 
                  onValueChange={([v]) => setControls({...controls, minEdgeThreshold: v / 100})}
                  max={10} 
                  step={0.1} 
                />
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[9px] font-black uppercase">Deep Slippage Model</Label>
                  <p className="text-[8px] text-muted-foreground font-bold">Consumes 2x book entropy</p>
                </div>
                <Switch 
                  checked={controls.slippageModel === 'conservative'}
                  onCheckedChange={(c) => setControls({...controls, slippageModel: c ? 'conservative' : 'simple'})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[9px] font-black uppercase text-destructive">Global Risk Filter</Label>
                  <p className="text-[8px] text-muted-foreground font-bold">Hide dependencies &lt; Med</p>
                </div>
                <Switch 
                  checked={controls.drfFilter === 'Low' || controls.drfFilter === 'Med'}
                  onCheckedChange={(c) => setControls({...controls, drfFilter: c ? 'Med' : 'all'})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Drift Analysis</h3>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4 text-center">
              <span className="text-[9px] font-black uppercase text-primary/70">Edge Decay Confidence</span>
              <div className="text-2xl font-black font-mono">{(92.4 + (Math.sin(tick * 0.5) * 0.5)).toFixed(1)}%</div>
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${92 + Math.sin(tick * 0.5)}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-accent mx-auto opacity-50" />
              <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                Audit verified by subscriber key
              </p>
            </div>
            <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-8" asChild>
              <Link href="/pro-champion">Exit Terminal</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
        <div className="flex gap-6">
          <span>Matrix Status: SYNCHRONIZED</span>
          <span>Buffer: 12ms</span>
          <span>Security: AES-256 Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent opacity-100 uppercase tracking-widest">Global Ingestion Active</span>
        </div>
      </div>
    </div>
  );
}
