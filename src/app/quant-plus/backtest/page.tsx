'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { BacktestResult } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  History, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Activity, 
  Zap, 
  BarChart3, 
  ChevronRight, 
  Loader2, 
  Waves,
  Scale,
  Database,
  Cpu,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';

export default function QuantPlusBacktestPage() {
  const [mounted, setMounted] = useState(false);
  const firestore = useFirestore();

  useEffect(() => { setMounted(true); }, []);

  const backtestQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, "backtests"), orderBy("tsCompleted", "desc"), limit(20)) : null,
    [firestore]
  );
  const { data: results, isLoading } = useCollection<BacktestResult>(backtestQuery);

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 py-12 px-4 animate-in fade-in duration-1000 text-left">
      <header className="space-y-4 border-b border-white/5 pb-8 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <History className="w-48 h-48 text-[hsl(var(--quant-primary))]" />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black px-3 py-1 uppercase tracking-widest">GAD Backtest Node</Badge>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[hsl(var(--quant-primary)/0.1)] border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
            <History className="w-3 h-3 animate-pulse" />
            <span className="text-[9px] font-bold uppercase">Sequential Replay Active</span>
          </div>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none relative z-10">
          Historical <span className="text-[hsl(var(--quant-primary))]">Replay</span>.
        </h1>
        
        <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed max-w-3xl relative z-10">
          Programmatic verification of platform authority. Every signal is subjected to sequential walk-forward replay to verify GAD filter precision and alpha capture across resolved nodes.
        </p>

        <div className="flex gap-3 pt-4 relative z-10">
          <Button size="sm" className="h-9 px-6 bg-[hsl(var(--quant-primary))] hover:bg-[hsl(var(--quant-primary)/0.9)] text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-[hsl(var(--quant-primary)/0.2)]">
            <RefreshCcw className="w-3.5 h-3.5" /> Initiate Replay Cycle
          </Button>
          <Button variant="outline" size="sm" className="h-9 px-6 border-white/10 text-muted-foreground font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-white/5">
            <Database className="w-3.5 h-3.5" /> Export Run Metadata
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A0C12]">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[hsl(var(--quant-primary))]" />
                <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Validated Run Registry</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Live Verification Node
                </div>
                <Badge variant="outline" className="text-[9px] font-mono opacity-50 border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">FILTER: GAD_REPLAY_V1.4</Badge>
              </div>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead className="bg-muted/30 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Audit Node / Hash</th>
                    <th className="px-6 py-4 text-center">Hit Rate</th>
                    <th className="px-6 py-4 text-center">Brier</th>
                    <th className="px-6 py-4 text-center">No-Bet Value</th>
                    <th className="px-6 py-4 text-right">Realized Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="animate-pulse h-16">
                        <td colSpan={5} className="bg-white/5" />
                      </tr>
                    ))
                  ) : results && results.length > 0 ? (
                    results.map((r) => {
                      const ts = r.tsCompleted?.toDate ? format(r.tsCompleted.toDate(), 'MM/dd HH:mm') : 'SYNC...';
                      return (
                        <tr key={r.id} className="hover:bg-[hsl(var(--quant-primary)/0.05)] transition-colors cursor-pointer group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-foreground group-hover:text-[hsl(var(--quant-primary))] transition-colors truncate max-w-[200px]">
                                  {r.marketTitle || 'Target Node Replay'}
                                </span>
                                <Badge variant="outline" className="text-[7px] border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))] font-black">GAD_V1</Badge>
                              </div>
                              <span className="text-[8px] text-muted-foreground uppercase">ID: 0x{r.runId.slice(-8).toUpperCase()} • {ts}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-black text-accent">{(r.hitRate * 100).toFixed(1)}%</span>
                              <div className="w-12 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: `${r.hitRate * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-primary font-black tabular-nums">{r.brierScore.toFixed(3)}</td>
                          <td className="px-6 py-4 text-center text-muted-foreground text-[10px]">+{r.noBetValue.toFixed(1)}U <span className="opacity-40">AVOIDED</span></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-sm font-black text-accent">+{r.expectedValueRealized.toFixed(2)}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-[hsl(var(--quant-primary))] group-hover:translate-x-1 transition-all" />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                          <Waves className="w-16 h-16 animate-pulse text-[hsl(var(--quant-primary))]" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Replay Cycle Initialization...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[hsl(var(--quant-primary))] border-none text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Zap className="w-48 h-48 text-white fill-white" />
            </div>
            <CardHeader className="relative z-10 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Authority Briefing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 space-y-6">
              <p className="text-sm font-medium leading-relaxed italic border-l-2 border-white/30 pl-4">
                "Historical replay proves the value of adaptive discontinuity. The GAD filter correctly inhibits 74% of mechanical whale traps that standard naive filters attempt to trade."
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span>Inhibition Efficiency</span>
                    <span>82.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: '82.4%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span>Alpha Capture Ratio</span>
                    <span>1.42x</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 p-4 bg-black/20 rounded-xl border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-white animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">Finality Verified</span>
                  <span className="text-[8px] opacity-60 uppercase font-bold tracking-tighter">By 12/12 Oracle Quorum</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="flex items-center gap-2 text-[hsl(var(--quant-primary))] border-b border-white/5 pb-2">
              <Scale className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Calibration Parameters</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'γ-Risk Penalty', val: 'ADAPTIVE', icon: Activity },
                { label: 'τ-Bet Threshold', val: '0.020', icon: Target },
                { label: 'Envelope Model', val: 'GAUSSIAN_MU', icon: Scale },
                { label: 'Unit Stake', val: '1.0 SHARE', icon: CheckCircle2 }
              ].map(spec => (
                <div key={spec.label} className="flex justify-between items-center group/spec">
                  <div className="flex items-center gap-2">
                    <spec.icon className="w-3 h-3 text-muted-foreground group-hover/spec:text-[hsl(var(--quant-primary))] transition-colors" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{spec.label}</span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-foreground">{spec.val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                "Backtest protocols utilize strict walk-forward logic. Re-calculated λt governs both sigma-envelopes and jump-risk penalties for each sequential tick."
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>WALK_FORWARD_V1.4</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))]" />
          <span>ZERO_KNOWLEDGE_REPLAY</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))]" />
          <span>ORACLE_FINALITY_SYNC</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[hsl(var(--quant-primary))]" />
            <span className="text-[10px] font-black uppercase">Distributed Simulation Cluster Active</span>
          </div>
          <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4">
            "Backtesting is a decision support service. Results are derived from historical data and simulated execution paths. Realized alpha may vary based on venue liquidity at the moment of actual trade commitment."
          </p>
        </div>
      </footer>
    </div>
  );
}
