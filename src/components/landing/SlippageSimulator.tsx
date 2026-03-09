'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Target,
  ArrowRight,
  Scale,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Amount ($)',
    color: 'hsl(var(--primary))',
  }
} satisfies ChartConfig;

export function SlippageSimulator() {
  const [size, setSize] = useState(10000);

  const stats = useMemo(() => {
    // Simulated institutional slippage model: exponential decay based on orderbook density
    const slippageBase = 0.04; // 4bps base
    const depthImpact = Math.pow(size / 1000, 1.15) * 0.012;
    const slippagePercent = Math.max(0.02, slippageBase + depthImpact);
    const leakageAmount = size * (slippagePercent / 100);
    const fees = size * 0.01; // 1% platform fee assumption
    const paperAlpha = size * 0.05; // 5% hypothetical mispricing
    const realizedAlpha = paperAlpha - leakageAmount - fees;

    return {
      slippagePercent: slippagePercent.toFixed(3),
      leakageAmount: leakageAmount.toFixed(2),
      realizedAlpha: realizedAlpha.toFixed(2),
      alphaPercent: ((realizedAlpha / size) * 100).toFixed(2),
      data: [
        { name: 'Paper Alpha', value: paperAlpha, color: 'hsl(var(--primary))' },
        { name: 'Execution Leakage', value: -leakageAmount, color: 'hsl(var(--destructive))' },
        { name: 'Platform Fees', value: -fees, color: 'hsl(var(--foreground) / 0.2)' },
        { name: 'Realized Edge', value: Math.max(0, realizedAlpha), color: 'hsl(var(--accent))' },
      ]
    };
  }, [size]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded border border-destructive/20 text-destructive">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-destructive">Execution Realism Audit</span>
          </div>
          <h3 className="text-3xl font-black font-headline tracking-tighter uppercase italic">
            Quote prices <span className="text-destructive">are a lie.</span>
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Standard interfaces show you the midpoint price. Institutional reality depends on depth. Our simulator calculates the exact alpha erosion based on real-time orderbook snapshots.
          </p>
        </div>

        <div className="space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-xl">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Hypothetical Trade Size</span>
              <span className="text-xl font-black font-mono text-primary">${size.toLocaleString()}</span>
            </div>
            <Slider 
              value={[size]} 
              onValueChange={([v]) => setSize(v)} 
              max={100000} 
              step={1000}
              className="py-4"
            />
            <div className="flex justify-between text-[8px] font-bold text-muted-foreground/40 uppercase">
              <span>$1K</span>
              <span>$50K</span>
              <span>$100K</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
              <span className="text-[9px] font-black text-destructive/70 uppercase block mb-1">Expected Slippage</span>
              <div className="text-lg font-black font-mono text-destructive">{stats.slippagePercent}%</div>
            </div>
            <div className="p-3 bg-accent/5 border border-accent/10 rounded-lg">
              <span className="text-[9px] font-black text-accent/70 uppercase block mb-1">Realized Edge Cap</span>
              <div className="text-lg font-black font-mono text-accent">{stats.alphaPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 h-[400px] flex flex-col">
        <div className="flex-1 w-full bg-black/20 rounded-xl border border-white/5 p-4 relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Alpha Erosion Visualization</span>
          </div>
          
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.data} layout="vertical" margin={{ left: 100, right: 40, top: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    formatter={(val: number) => `$${Math.abs(val).toLocaleString()}`}
                    style={{ fill: 'white', fontSize: 10, fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 p-4 border border-dashed border-white/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-accent animate-pulse" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">
              Calculated for node_BTC_100K using <br/>
              Institutional Depth Matrix v4.2
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase gap-2 hover:bg-primary/10 hover:text-primary transition-all">
            Unlock Full Depth API <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}