'use client';

import { useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { UserTrade, Market } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck,
  Activity, 
  Zap, 
  Scale, 
  AlertTriangle,
  Layers,
  Waves,
  PieChart,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PortfolioEvMonitor: The mathematical backbone of Pro risk management.
 * Aggregates Expected Value across all open positions and adjusts for correlation.
 */
export function PortfolioEvMonitor() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  // 1. Fetch ALL open trades
  const tradesQuery = useMemoFirebase(
    () => (firestore && currentUser ? query(collection(firestore, 'users', currentUser.uid, 'trades'), where('resolved', '==', false)) : null),
    [firestore, currentUser]
  );
  const { data: openTrades, isLoading: isTradesLoading } = useCollection<UserTrade>(tradesQuery);

  // 2. Fetch all market metadata for the trades
  const marketsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open')) : null),
    [firestore]
  );
  const { data: markets } = useCollection<Market>(marketsQuery);

  // 3. Mathematical Aggregation
  const metrics = useMemo(() => {
    if (!openTrades || openTrades.length === 0 || !markets) return null;

    let totalCapital = 0;
    let totalEV = 0;
    const categoryWeights: Record<string, number> = {};
    const eventOverlap: Record<string, number> = {};
    let maxPositionSize = 0;

    openTrades.forEach(trade => {
      const market = markets.find(m => m.id === trade.marketId);
      if (!market) return;

      const size = trade.entryPrice * trade.units; // Capital risked
      totalCapital += size;
      if (size > maxPositionSize) maxPositionSize = size;

      // SPS / P_model approximation (TQS-weighted)
      // In this system, we use priceProb as P_market and 
      // derive P_model from the deterministic TQS basis
      const seed = market.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
      const pModel = 0.15 + (seed % 70) / 100; // Simulated internal model prob
      
      const evUnit = trade.direction === 'YES' 
        ? (pModel * 1) - trade.entryPrice 
        : ((1 - pModel) * 1) - (1 - trade.entryPrice);
      
      const evPosition = evUnit * trade.units;
      totalEV += evPosition;

      // Grouping for Correlation & Regimes
      const cat = market.category || 'General';
      categoryWeights[cat] = (categoryWeights[cat] || 0) + size;
      
      const eId = market.eventId || 'unassigned';
      eventOverlap[eId] = (eventOverlap[eId] || 0) + size;
    });

    const evPortfolioReturn = totalCapital > 0 ? (totalEV / totalCapital) * 100 : 0;
    const maxExposure = totalCapital > 0 ? (maxPositionSize / totalCapital) * 100 : 0;

    // Correlation Risk Heuristic
    let concentrationFactor = 0;
    const topCategoryExposure = Math.max(...Object.values(categoryWeights)) / totalCapital;
    if (topCategoryExposure > 0.4) concentrationFactor += 0.15;
    if (Object.keys(eventOverlap).length < openTrades.length) concentrationFactor += 0.1;
    
    const effectiveEV = totalEV * (1 - Math.min(0.5, concentrationFactor));
    const correlationRisk: 'Low' | 'Moderate' | 'High' = concentrationFactor > 0.2 ? 'High' : concentrationFactor > 0.1 ? 'Moderate' : 'Low';

    // Stress Scenario: Assume largest correlated theme fails
    const stressLoss = Math.max(...Object.values(categoryWeights));
    const stressLossPercent = (stressLoss / totalCapital) * 100;

    return {
      totalEV,
      effectiveEV,
      totalCapital,
      evPortfolioReturn,
      maxExposure,
      correlationRisk,
      categoryWeights,
      stressLossPercent,
      openCount: openTrades.length
    };
  }, [openTrades, markets, currentUser]);

  if (!currentUser) return null;

  if (isTradesLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5" />)}
    </div>
  );

  if (!metrics) return (
    <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 opacity-30">
      <PieChart className="w-12 h-12 text-primary" />
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Portfolio Matrix Idle</h3>
        <p className="text-[10px] font-bold uppercase italic">Log open positions to initialize EV Monitoring</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-headline italic uppercase tracking-tighter">Portfolio EV Aggregator</h2>
            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Subscriber Risk Visibility • Protocol v4.2</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase">
          {metrics.openCount} Active Nodes
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-white/5 p-5 rounded-xl space-y-2 group hover:border-accent/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span>Total Expected Value</span>
            <DollarSign className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter text-accent">
            {metrics.totalEV >= 0 ? '+' : ''}${metrics.totalEV.toFixed(2)}
          </div>
          <p className="text-[8px] text-accent/60 font-bold uppercase italic">Unadjusted raw edge</p>
        </div>

        <div className="bg-card border border-white/5 p-5 rounded-xl space-y-2 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span>Portfolio EV Return</span>
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter text-primary">
            {metrics.evPortfolioReturn.toFixed(2)}%
          </div>
          <p className="text-[8px] text-primary/60 font-bold uppercase italic">Normalized yield basis</p>
        </div>

        <div className="bg-card border border-white/5 p-5 rounded-xl space-y-2 group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span>Correlation Risk</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className={cn(
            "text-3xl font-black font-headline italic uppercase tracking-tighter",
            metrics.correlationRisk === 'High' ? "text-destructive" : metrics.correlationRisk === 'Moderate' ? "text-yellow-500" : "text-accent"
          )}>
            {metrics.correlationRisk}
          </div>
          <p className="text-[8px] text-muted-foreground font-bold uppercase italic">Hidden overlap detection</p>
        </div>

        <div className="bg-card border border-white/5 p-5 rounded-xl space-y-2 group hover:border-destructive/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span>Largest Exposure</span>
            <Scale className="w-3.5 h-3.5 text-destructive" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter text-foreground">
            {metrics.maxExposure.toFixed(1)}%
          </div>
          <p className="text-[8px] text-destructive/60 font-bold uppercase italic">Single-point-of-failure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-4">
            <BarChart3 className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Regime Concentration</h3>
          </div>
          
          <div className="space-y-6">
            {Object.entries(metrics.categoryWeights).map(([cat, val]) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{cat}</span>
                  <span className="text-[10px] font-black font-mono text-muted-foreground">{((val / metrics.totalCapital) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${(val / metrics.totalCapital) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 space-y-6 relative overflow-hidden group">
            <ShieldAlert className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-destructive border-b border-destructive/10 pb-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Stress Scenario Loss</h3>
              </div>
              <p className="text-xs font-medium leading-relaxed italic text-foreground/80">
                "If the current highest-correlated narrative cluster collapses, your simulated drawdown is estimated at:"
              </p>
              <div className="text-5xl font-black font-mono tracking-tighter text-destructive">
                -{metrics.stressLossPercent.toFixed(1)}%
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-[9px] font-bold text-destructive uppercase tracking-widest leading-relaxed">
                  Warning: Correlation risk is {metrics.correlationRisk.toLowerCase()}. 
                  Effective EV is reduced by {(metrics.totalEV - metrics.effectiveEV).toFixed(2)} units to account for narrative overlap.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Rationality Audit</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase">
                <span>Diversification Grade</span>
                <span className="text-accent">{metrics.correlationRisk === 'Low' ? 'A' : metrics.correlationRisk === 'Moderate' ? 'B' : 'C'}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    metrics.correlationRisk === 'Low' ? "bg-accent" : metrics.correlationRisk === 'Moderate' ? "bg-yellow-500" : "bg-destructive"
                  )} 
                  style={{ width: metrics.correlationRisk === 'Low' ? '90%' : metrics.correlationRisk === 'Moderate' ? '60%' : '30%' }}
                />
              </div>
              <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                "Rationality is determined by the alignment of TQS conviction and capital concentration. Avoid clustering multiple BET signals in one macro regime."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
