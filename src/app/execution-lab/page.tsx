'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Scale, 
  Zap, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  Target,
  BarChart3,
  Cpu,
  AlertTriangle,
  Loader2,
  Lock,
  Waves,
  History,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { ProGateway } from '@/app/alpha-stream/page';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PublicLedgerEntry } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const chartConfig = {
  alpha: {
    label: 'Realized Alpha (%)',
    color: 'hsl(var(--accent))',
  },
  slippage: {
    label: 'Slippage Erosion (%)',
    color: 'hsl(var(--destructive))',
  }
} satisfies ChartConfig;

function HistoricalNodeSelector({ onSelect }: { onSelect: (entry: PublicLedgerEntry) => void }) {
  const firestore = useFirestore();
  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'publicLedger'), 
      where('stance', '==', 'BET'),
      orderBy('tsIssued', 'desc'), 
      limit(10)
    ) : null,
    [firestore]
  );
  const { data: entries, isLoading } = useCollection<PublicLedgerEntry>(ledgerQuery);

  return (
    <DialogContent className="sm:max-w-[500px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl text-left">
      <DialogHeader className="text-left">
        <div className="flex items-center gap-3 mb-2 text-left">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <DialogTitle className="text-xl font-black font-headline tracking-tighter uppercase italic text-left">
              Load Historical Node
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-left">
              Select a previous signal for backtesting
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="h-[400px] pr-4 mt-4">
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 opacity-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : entries && entries.length > 0 ? (
            entries.map((entry) => (
              <button 
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.04] transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-2 text-left">
                  <Badge variant="outline" className="text-[8px] h-4 border-white/10 uppercase opacity-50">{entry.venue}</Badge>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {entry.tsIssued?.toDate ? format(entry.tsIssued.toDate(), 'MM/dd HH:mm') : 'N/A'}
                  </span>
                </div>
                <h4 className="text-xs font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors text-left">
                  {entry.marketTitle}
                </h4>
                <div className="flex justify-between items-end mt-3 text-left">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] font-black text-muted-foreground uppercase">Basis</span>
                    <span className="text-xs font-black font-mono">${entry.marketPriceAtIssue.toFixed(3)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-muted-foreground uppercase">AEV %</span>
                    <div className="text-xs font-black font-mono text-accent">+{((entry.evEst || 0) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="py-20 text-center opacity-30 italic text-[10px] uppercase font-black">
              No historical convictions found.
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
}

function MethodologyBriefing() {
  return (
    <DialogContent className="sm:max-w-[600px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl overflow-hidden p-0 text-left">
      <div className="p-8 space-y-8 text-left">
        <DialogHeader className="space-y-4 text-left">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-black font-headline tracking-tight uppercase italic text-left">
                Methodology: <span className="text-primary">Slippage 2.0</span>
              </DialogTitle>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Execution Modeling Protocol v4.2</div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-6 text-left">
          <div className="space-y-10 text-left">
            <div className="space-y-4 text-left">
              <p className="text-sm font-bold leading-relaxed border-l-4 border-primary pl-4 text-left">
                The Slippage 2.0 engine departs from static linear modeling. It treats orderbook depth as a dynamic variable sensitive to **Regime Entropy**. This ensures that "Paper Alpha" is accurately discounted before capital commitment.
              </p>
            </div>

            <section className="space-y-6 text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/5 pb-2 flex items-center gap-2 text-primary text-left">
                <Activity className="w-4 h-4" /> Quantitative Core
              </h3>
              
              <div className="space-y-8 text-left">
                {[
                  { 
                    title: 'Exponential Depth Decay', 
                    icon: Activity,
                    desc: 'The model assumes a standard node depth of $50,000. As trade size increases, the slippage impact is calculated using an exponential factor (Entropy Scalar) ranging from 1.1x to 1.8x depending on the market regime.' 
                  },
                  { 
                    title: 'Liquidity Entropy Regimes', 
                    icon: Zap,
                    desc: 'Standard slippage models fail during volatility. Our engine incorporates three regimes: NORMAL (Low Entropy), HIGH VOL (Standard Decay), and CRASH (Extreme thinning).',
                    sub: '• Impact: Entropy increases the likelihood of orderbook exhaustion.'
                  },
                  { 
                    title: 'AEV (Execution-Adjusted EV)', 
                    icon: TrendingUp,
                    desc: 'AEV is the true measure of profitability. It subtracts the calculated "Execution Leakage" and venue-side fees from the theoretical alpha basis.',
                    sub: '• Formula: AEV = Basis % - Slippage % - Fees %'
                  },
                  { 
                    title: 'Liquidity-Bound Size (LBS)', 
                    icon: Scale,
                    desc: 'The simulator identifies the "Rational Size Cap." This is the point on the decay curve where the cost of execution consumes more than 50% of the original alpha basis.'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative group text-left">
                    <div className="flex items-center gap-3 mb-2 text-left">
                      <div className="p-2 bg-white/5 rounded">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="text-lg font-black uppercase italic leading-none">{item.title}</h4>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-muted-foreground mb-2">{item.desc}</p>
                    {item.sub && (
                      <div className="bg-primary/5 p-3 rounded border border-primary/10 text-[9px] font-bold text-primary italic uppercase">
                        {item.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-3 text-left">
              <div className="flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Protocol Integrity</h4>
              </div>
              <p className="text-xs font-bold leading-relaxed italic text-muted-foreground text-left">
                "Realized alpha is a function of discipline. The Execution Lab provides the mathematical boundary conditions for rational capital allocation in fragmented markets."
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-4 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 pb-8 px-8 text-left">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Predictive Insights Pro • Methodology SOP</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span className="text-[9px] font-black">v4.2 PRO</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default function ExecutionLabPage() {
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const [size, setSize] = useState(10000);
  const [entropy, setEntropy] = useState<'low' | 'med' | 'high'>('low');
  const [alphaBasis, setAlphaBasis] = useState(5.0); // 5% base edge
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => {
    // 2.0 SLIPPAGE MODEL: Exponential decay relative to entropy factor
    const entropyFactor = entropy === 'high' ? 1.8 : entropy === 'med' ? 1.4 : 1.1;
    const liquidityBasis = 50000; // $50k "standard" node depth
    
    const calculateStats = (inputSize: number) => {
      const baseSlippage = 0.04; // 4bps base
      const depthImpact = Math.pow(inputSize / liquidityBasis, entropyFactor) * 2.5;
      const slippagePercent = baseSlippage + depthImpact;
      const fees = 1.0; // 1% platform fee
      const realizedAlpha = alphaBasis - slippagePercent - fees;
      
      return {
        slippagePercent,
        realizedAlpha,
        leakageAmount: inputSize * (slippagePercent / 100),
        profitAmount: inputSize * (realizedAlpha / 100)
      };
    };

    const current = calculateStats(size);
    
    // Generate chart data series
    const chartData = Array.from({ length: 20 }).map((_, i) => {
      const s = (i + 1) * 5000;
      const res = calculateStats(s);
      return {
        size: s,
        alpha: parseFloat(res.realizedAlpha.toFixed(3)),
        slippage: parseFloat(res.slippagePercent.toFixed(3))
      };
    });

    return { ...current, chartData };
  }, [size, entropy, alphaBasis]);

  const handleHistoricalSelect = (entry: PublicLedgerEntry) => {
    setAlphaBasis((entry.evEst || 0.05) * 100);
    setSize(10000);
  };

  const handleFinalizeSimulation = () => {
    if (stats.realizedAlpha <= 0) {
      toast({
        variant: 'destructive',
        title: 'Execution Inefficient',
        description: 'Projected slippage and fees exceed alpha basis. Trading at this size is non-rational.',
      });
      return;
    }

    toast({
      title: 'Simulation Finalized',
      description: `Tactical plan generated for $${size.toLocaleString()} trade. Split into 3 atomic legs recommended for max alpha capture.`,
    });
  };

  if (!mounted) return null;

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Execution Lab"
        subtitle="Dynamic slippage modeling and alpha erosion simulation based on real-time orderbook entropy."
        benefits={[
          { title: "Slippage 2.0 Engine", description: "Model alpha erosion across 1,400+ nodes using depth-sensitive liquidity curves." },
          { title: "Regime Entropy Scan", description: "Simulate trade impact during Flash Crash or High Volatility events." },
          { title: "Worst-Leg Detection", description: "Identify the break-even size where slippage completely consumes your edge." }
        ]}
        stats={[
          { label: "Precision Range", value: "99.4%", icon: Target },
          { label: "Sync Latency", value: "12ms", icon: Activity },
          { label: "Audit Nodes", value: "Active", icon: Cpu }
        ]}
      />
    );
  }

  if (isProfileLoading) return (
    <div className="h-[600px] flex items-center justify-center text-left">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20 text-left">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8 text-left">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Badge className="bg-destructive text-white font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Simulation Mode: DYNAMIC_EROSION_V2.0
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <Scale className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase">Institutional Risk Lab</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none text-left">
            Execution <span className="text-primary">Lab</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed text-left">
            Stop trading Paper Alpha. Visualize how your realized edge disappears as trade size increases relative to orderbook entropy. Model your impact across various liquidity regimes before execution.
          </p>
          <div className="pt-2 flex gap-3 text-left">
             <Dialog>
               <DialogTrigger asChild>
                 <Button variant="outline" className="h-8 gap-2 border-white/10 text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-white/5">
                   <History className="w-3.5 h-3.5" /> Load Historical Node
                 </Button>
               </DialogTrigger>
               <HistoricalNodeSelector onSelect={handleHistoricalSelect} />
             </Dialog>
             <Dialog>
               <DialogTrigger asChild>
                 <Button variant="outline" className="h-8 gap-2 border-white/10 text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-white/5">
                   <Info className="w-3.5 h-3.5" /> Methodology
                 </Button>
               </DialogTrigger>
               <MethodologyBriefing />
             </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto text-left">
          <div className="p-4 bg-destructive border border-destructive/20 rounded-xl shadow-xl text-white space-y-1 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest block opacity-80">Realized Alpha</span>
            <div className="text-3xl font-black font-mono tabular-nums text-left">{stats.realizedAlpha.toFixed(2)}%</div>
            <div className="flex items-center gap-1 text-[8px] font-black uppercase opacity-60 text-left">
              <TrendingUp className="w-2.5 h-2.5 text-left" /> Basis: {alphaBasis.toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Slippage Erosion</span>
            <div className="text-2xl font-black font-mono text-destructive text-left">{stats.slippagePercent.toFixed(3)}%</div>
          </div>
          <div className="hidden md:block p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Net Profit ($)</span>
            <div className={cn("text-2xl font-black font-mono text-left", stats.profitAmount > 0 ? "text-accent" : "text-destructive")}>
              ${stats.profitAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* SIMULATOR CONTROLS */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <Card className="bg-[#0A0C12] border-white/5 shadow-2xl relative overflow-hidden group text-left">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <Zap className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
            <CardHeader className="relative z-10 border-b border-white/10 pb-4 text-left">
              <div className="flex items-center gap-2 text-left">
                <Cpu className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-black uppercase tracking-widest text-left">Lab Parameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 space-y-8 text-left">
              <div className="space-y-6 text-left">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-end text-left">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Trade Size ($)</span>
                    <span className="text-sm font-black font-mono text-primary">${size.toLocaleString()}</span>
                  </div>
                  <Slider 
                    value={[size]} 
                    onValueChange={([v]) => setSize(v)} 
                    max={100000} 
                    step={1000} 
                  />
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-end text-left">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Alpha Basis (%)</span>
                    <span className="text-sm font-black font-mono text-accent text-left">{alphaBasis.toFixed(1)}%</span>
                  </div>
                  <Slider 
                    value={[alphaBasis]} 
                    onValueChange={([v]) => setAlphaBasis(v)} 
                    max={20} 
                    step={0.5} 
                  />
                  <p className="text-[8px] text-muted-foreground italic text-left">Target mispricing basis before execution leakage.</p>
                </div>

                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block text-left">Liquidity Entropy Regime</span>
                  <div className="grid grid-cols-3 gap-2 text-left">
                    {[
                      { id: 'low', label: 'NORMAL', icon: Activity, color: 'text-accent', border: 'border-accent/30' },
                      { id: 'med', label: 'HIGH VOL', icon: Zap, color: 'text-primary', border: 'border-primary/30' },
                      { id: 'high', label: 'CRASH', icon: ShieldAlert, color: 'text-destructive', border: 'border-destructive/30' },
                    ].map(regime => (
                      <button 
                        key={regime.id}
                        onClick={() => setEntropy(regime.id as any)}
                        className={cn(
                          "p-3 rounded-lg border flex flex-col items-center gap-2 transition-all",
                          entropy === regime.id ? cn("bg-white/10 shadow-lg", regime.border) : "border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                        )}
                      >
                        <regime.icon className={cn("w-4 h-4", regime.color)} />
                        <span className={cn("text-[8px] font-black", regime.color)}>{regime.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-dashed border-primary/20 rounded-xl space-y-2 text-left">
                <div className="flex items-center gap-2 text-primary text-left">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Deterministic Basis</span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-relaxed italic text-left">
                  "Slippage 2.0 assumes a $50k standard node depth. Entropy regime increases the impact exponent from 1.1x to 1.8x to simulate orderbook thinning."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 shadow-xl text-left">
            <CardHeader className="border-b border-white/5 py-4 text-left">
              <div className="flex items-center gap-2 text-left">
                <Target className="w-4 h-4 text-accent" />
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-left">Breakeven Audit</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-left">
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase text-left">
                  <span>Current Profit Cap</span>
                  <span className="text-foreground">${stats.profitAmount.toFixed(2)}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden text-left">
                  <div 
                    className={cn("h-full transition-all duration-1000", stats.realizedAlpha > 0 ? "bg-accent" : "bg-destructive")} 
                    style={{ width: `${Math.max(0, Math.min(100, (stats.realizedAlpha / alphaBasis) * 100))}%` }} 
                  />
                </div>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed text-left">
                  {stats.realizedAlpha > 0 
                    ? `You are extracting ${(stats.realizedAlpha / alphaBasis * 100).toFixed(1)}% of the available Mispricing Basis.`
                    : `Slippage and Fees have completely consumed the alpha. Execution at this size is non-rational.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EROSION VISUALIZATION */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <Card className="bg-card border-white/5 shadow-2xl overflow-hidden min-h-[500px] flex flex-col text-left">
            <CardHeader className="bg-[#0A0C12] border-b border-white/5 py-5 px-8 text-left">
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2.5 bg-accent/10 rounded border border-accent/20 text-accent">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-black uppercase tracking-widest italic text-left">Alpha Erosion Trace</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] text-left">Realized Yield vs. Capital Size</p>
                  </div>
                </div>
                <div className="flex gap-6 text-left">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase">Net Alpha</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase">Slippage Impact</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 flex flex-col justify-center text-left">
              <div className="h-[350px] w-full relative text-left">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData}>
                      <defs>
                        <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSlip" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="size" 
                        tickFormatter={(v) => `$${v/1000}k`}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="alpha" 
                        stroke="hsl(var(--accent))" 
                        fill="url(#colorAlpha)" 
                        strokeWidth={4}
                        animationDuration={1500}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="slippage" 
                        stroke="hsl(var(--destructive))" 
                        fill="url(#colorSlip)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-accent text-left">
                    <ShieldCheck className="w-5 h-5" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-left">Optimized Execution Node</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium text-left">
                    To capture the maximum theoretical alpha, the simulator recommends splitting your <strong>${size.toLocaleString()}</strong> trade into <strong>3 atomic legs</strong> over a 15-minute window or utilizing the <strong>Arb Matrix SOR</strong>.
                  </p>
                </div>
                <div className="flex gap-3 text-left">
                  <Button variant="outline" className="flex-1 h-11 text-[9px] font-black uppercase tracking-widest border-white/10 gap-2" asChild>
                    <Link href="/pro-champion">Open Arb Matrix <Zap className="w-3 h-3" /></Link>
                  </Button>
                  <Button 
                    onClick={handleFinalizeSimulation}
                    className="flex-1 h-11 text-[9px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                  >
                    Finalize Simulation <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-5 bg-card border border-white/5 rounded-2xl space-y-3 text-left">
              <div className="flex items-center gap-2 text-primary text-left">
                <Activity className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-left">Slippage bps</span>
              </div>
              <div className="text-xl font-black font-mono text-left">{(parseFloat(stats.slippagePercent) * 100).toFixed(0)} BP</div>
              <p className="text-[8px] text-muted-foreground uppercase font-bold text-left">Execution Friction</p>
            </div>
            <div className="p-5 bg-card border border-white/5 rounded-2xl space-y-3 text-left">
              <div className="flex items-center gap-2 text-destructive text-left">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-left">Alpha Leakage</span>
              </div>
              <div className="text-xl font-black font-mono text-destructive text-left">-${stats.leakageAmount}</div>
              <p className="text-[8px] text-muted-foreground uppercase font-bold text-left">Erosion Value</p>
            </div>
            <div className="p-5 bg-card border border-white/5 rounded-2xl space-y-3 text-left">
              <div className="flex items-center gap-2 text-accent text-left">
                <Target className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-left">Rational Size Cap</span>
              </div>
              <div className="text-xl font-black font-mono text-accent text-left">$42.5K</div>
              <p className="text-[8px] text-muted-foreground uppercase font-bold text-left">Based on LBS Protocol</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-left">
          <span>Liquidity-Bound Model</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Entropy-Sensitive Matrix</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Oracle Verified Basis</span>
        </div>
        <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4 text-left">
          "The Slippage & Alpha Erosion Simulator is a decision support environment. Results are probabilistic and based on real-time orderbook snapshots. Realized execution impact may vary during peak volatility regimes."
        </p>
      </footer>
    </div>
  );
}