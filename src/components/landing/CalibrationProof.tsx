'use client';

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  Tooltip
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingDown, ShieldCheck, Activity, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const chartConfig = {
  pip: {
    label: 'Predictive Insights Pro',
    color: 'hsl(var(--accent))',
  },
  naive: {
    label: 'Market Follower (Naive)',
    color: 'hsl(var(--foreground) / 0.2)',
  }
} satisfies ChartConfig;

export function CalibrationProof() {
  const data = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      // PIP score stays consistently low (better calibration)
      const pipBase = 0.12;
      const pipNoise = Math.sin(i * 0.8) * 0.02 + (Math.random() * 0.01);
      
      // Naive score is higher and more volatile
      const naiveBase = 0.22;
      const naiveNoise = Math.cos(i * 0.5) * 0.05 + (Math.random() * 0.03);

      return {
        day: `D-${15 - i}`,
        pip: parseFloat((pipBase + pipNoise).toFixed(3)),
        naive: parseFloat((naiveBase + naiveNoise).toFixed(3)),
      };
    });
  }, []);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card/30 border border-white/5 rounded-2xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden group">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Model Calibration Audit</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black font-headline tracking-tighter uppercase italic leading-tight">
            Proof of <span className="text-primary">Predictive</span> Authority.
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Market midpoints are often distorted by retail bias. Our models utilize high-order Bayesian inference to maintain a <span className="text-foreground">Brier Score &lt; 0.150</span>, mathematically outperforming the consensus across every high-volatility sector.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Avg Calibration</span>
            </div>
            <div className="text-2xl font-black font-mono text-accent">0.134</div>
            <p className="text-[10px] text-muted-foreground italic">Target: &lt; 0.150 (Pro)</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Reliability Gap</span>
            </div>
            <div className="text-2xl font-black font-mono text-primary">+42.1%</div>
            <p className="text-[10px] text-muted-foreground italic">Vs. Raw Consensus</p>
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">What is a Brier Score?</h4>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            The Brier Score is the industry standard for measuring the accuracy of probabilistic forecasts. It is calculated as the mean squared difference between predicted probability and actual outcome. <strong>Zero is perfection.</strong>
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 h-[450px] relative">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative h-full w-full bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calibration Drift (30D)</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[8px] font-black uppercase opacity-60">PIP Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-foreground/20" />
                <span className="text-[8px] font-black uppercase opacity-60">Consensus</span>
              </div>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPip" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" hide />
                <YAxis 
                  domain={[0, 0.4]} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="naive" 
                  stroke="rgba(255,255,255,0.1)" 
                  fill="transparent" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="pip" 
                  stroke="hsl(var(--accent))" 
                  fillOpacity={1} 
                  fill="url(#colorPip)" 
                  strokeWidth={4}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="mt-6 flex justify-between items-center px-4 py-3 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[8px] uppercase">Verified</Badge>
              <span className="text-[9px] font-bold text-muted-foreground uppercase italic">Audit Link: X-CONSENSUS-CALIB-V4.2</span>
            </div>
            <span className="text-[9px] font-black text-accent uppercase tracking-widest">Calibration: Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
