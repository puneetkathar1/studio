'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Clock, 
  Loader2,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  tqs: {
    label: 'TQS Scalar',
    color: 'hsl(var(--primary))',
  }
} satisfies ChartConfig;

const TRANSITION_STEPS = [
  { 
    id: 1, 
    time: 'T-45s', 
    status: 'WAIT', 
    tqs: 0.008, 
    log: 'Scanning cluster for structural tension...',
    details: 'Orderbook depth nominal. Macro alignment: Neutral.'
  },
  { 
    id: 2, 
    time: 'T-30s', 
    status: 'WAIT', 
    tqs: 0.012, 
    log: 'Detecting basis drift in Kalshi Politics ladder.',
    details: 'SPS increasing. Capital concentration detected.'
  },
  { 
    id: 3, 
    time: 'T-12s', 
    status: 'WAIT', 
    tqs: 0.018, 
    log: 'Macro Ingestion: US CPI (YoY) confirms bearish bias.',
    details: 'CMCI re-weighted. TQS approaching threshold.'
  },
  { 
    id: 4, 
    time: 'T-0s', 
    status: 'BET', 
    tqs: 0.024, 
    log: 'α-TRIGGER: TQS threshold crossed (0.02).',
    details: 'Signal issued to Pro matrix. Execution ready.'
  }
];

export function StanceTransitionAlert() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % TRANSITION_STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    return TRANSITION_STEPS.slice(0, activeStep + 1).map((s, i) => ({
      index: i,
      tqs: s.tqs
    }));
  }, [activeStep]);

  const current = TRANSITION_STEPS[activeStep];

  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Stance Transition Audit</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Moment of Conviction v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase text-accent tracking-widest">Live Transition Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* TIMELINE VIEW */}
        <div className="lg:col-span-5 p-6 border-r border-white/5 space-y-6">
          <div className="space-y-4">
            {TRANSITION_STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;
              
              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex gap-4 relative transition-all duration-500",
                    isActive ? "opacity-100 scale-100" : isPast ? "opacity-40 grayscale" : "opacity-20"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-background",
                      step.status === 'BET' ? "border-accent text-accent" : "border-primary text-primary",
                      isActive && "animate-pulse shadow-[0_0_10px_currentColor]"
                    )}>
                      {step.status === 'BET' ? <Zap className="w-3 h-3 fill-current" /> : <Clock className="w-3 h-3" />}
                    </div>
                    {idx !== TRANSITION_STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-white/10 my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{step.time}</span>
                      <Badge variant={step.status === 'BET' ? 'default' : 'secondary'} className="text-[8px] h-4 font-black">
                        {step.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold leading-tight">{step.log}</p>
                    {isActive && (
                      <p className="text-[10px] text-muted-foreground mt-1 italic animate-in fade-in slide-in-from-left-2">{step.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VISUALIZATION VIEW */}
        <div className="lg:col-span-7 p-8 bg-black/20 flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Alpha Convergence</span>
              <h4 className="text-xl font-black font-headline italic uppercase tracking-tight">
                Threshold <span className="text-primary">θ_bet</span> Scan
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Current TQS</span>
              <div className={cn(
                "text-3xl font-black font-mono tracking-tighter tabular-nums",
                current.status === 'BET' ? "text-accent" : "text-primary"
              )}>
                {current.tqs.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="flex-1 h-[200px] w-full relative">
            <div className="absolute top-[20%] left-0 w-full border-t border-accent/30 border-dashed z-0">
              <span className="absolute -top-4 right-0 text-[8px] font-black text-accent uppercase tracking-widest bg-black px-2">Trigger Threshold (0.02)</span>
            </div>
            
            <ChartContainer config={chartConfig} className="h-full w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTqs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={current.status === 'BET' ? "hsl(var(--accent))" : "hsl(var(--primary))"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="index" hide />
                  <YAxis domain={[0, 0.03]} hide />
                  <Area 
                    type="monotone" 
                    dataKey="tqs" 
                    stroke={current.status === 'BET' ? "hsl(var(--accent))" : "hsl(var(--primary))"} 
                    fillOpacity={1} 
                    fill="url(#colorTqs)" 
                    strokeWidth={4}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-all">
              <div className={cn(
                "p-2 rounded bg-primary/10 border border-primary/20",
                current.status === 'WAIT' ? "text-primary animate-pulse" : "text-muted-foreground"
              )}>
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground uppercase">Phase 1</span>
                <span className="text-xs font-bold uppercase">Inhibited WAIT</span>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-accent/30 transition-all">
              <div className={cn(
                "p-2 rounded",
                current.status === 'BET' ? "bg-accent/10 border border-accent/20 text-accent animate-pulse" : "bg-muted text-muted-foreground border border-white/5"
              )}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground uppercase">Phase 2</span>
                <span className="text-xs font-bold uppercase">Alpha Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-4">
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Protocol: Unified Stance Engine v4.2</span>
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Audit Mode: Enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-accent" />
          <span className="text-[8px] font-black uppercase tracking-widest">Deterministic Proof of Stance</span>
        </div>
      </div>
    </div>
  );
}
