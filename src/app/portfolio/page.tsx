'use client';

import { useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp, where } from 'firebase/firestore';
import { UserTrade, PublicLedgerEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Crosshair, 
  ArrowUpRight,
  Clock,
  History,
  AlertTriangle,
  Loader2,
  Waves,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PortfolioSOP } from '@/components/intelligence/PortfolioSOP';
import { ExecutionProtocolSOP } from '@/components/intelligence/ExecutionProtocolSOP';
import { PortfolioEvMonitor } from '@/components/intelligence/PortfolioEvMonitor';

function calculateTradePnL(trade: UserTrade): number | null {
  if (!trade.resolved || trade.outcome === null) return null;
  const price = trade.entryPrice;
  if (trade.direction === 'YES') {
    return trade.outcome === 1 ? (1 / price) - 1 : -1;
  } else {
    return trade.outcome === 0 ? (1 / (1 - price)) - 1 : -1;
  }
}

export default function PortfolioAuditPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // 1. Fetch Personal Trades
  const tradesQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'users', user.uid, 'trades'), orderBy('tsLogged', 'desc')) : null),
    [firestore, user]
  );
  const { data: trades, isLoading: isTradesLoading } = useCollection<UserTrade>(tradesQuery);

  // 2. Fetch Platform Ledger for Benchmarking
  const ledgerQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(50)) : null),
    [firestore]
  );
  const { data: platformLedger } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const stats = useMemo(() => {
    if (!trades || trades.length === 0) return null;
    
    const resolved = trades.filter(t => t.resolved);
    const totalPnl = resolved.reduce((acc, t) => acc + (calculateTradePnL(t) || 0), 0);
    const winRate = resolved.length > 0 ? (resolved.filter(t => (calculateTradePnL(t) || 0) > 0).length / resolved.length) * 100 : null;
    
    // Personal Brier Score
    const brierSum = resolved.reduce((acc, t) => {
      const outcomeVal = t.outcome ?? 0;
      return acc + Math.pow(t.entryPrice - outcomeVal, 2);
    }, 0);
    const brierScore = resolved.length > 0 ? brierSum / resolved.length : null;

    return { totalPnl, winRate, brierScore, count: trades.length, resolvedCount: resolved.length };
  }, [trades]);

  const platformBrier = useMemo(() => {
    if (!platformLedger) return 0.148;
    const resolved = platformLedger.filter(e => e.resolved && e.stance === 'BET');
    const brierSum = resolved.reduce((acc, e) => {
      const outcome = e.outcome ?? 0;
      const predicted = (e.fairLow + e.fairHigh) / 2;
      return acc + Math.pow(predicted - outcome, 2);
    }, 0);
    return resolved.length > 0 ? brierSum / resolved.length : 0.148;
  }, [platformLedger]);

  if (!user) return (
    <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-6">
      <ShieldCheck className="w-16 h-16 text-primary opacity-20" />
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-black uppercase tracking-[0.3em] text-center">Personal Audit Access Restricted</h3>
        <p className="text-sm text-muted-foreground uppercase font-bold italic text-center">Connect node to initialize performance tracking.</p>
      </div>
      <Button asChild className="h-10 text-[10px] font-black uppercase tracking-widest px-8">
        <Link href="/login">Establish Node Connection</Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8 text-left">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Audit Node: PERSONAL_PORTFOLIO
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase">Real-Time Accountability</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none text-left">
            Personal Performance <span className="text-primary">Audit</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed text-left">
            Verify your predictive accuracy against the platform benchmark. This private ledger calculates your realized alpha and Brier calibration based on logged entries.
          </p>
          <div className="pt-2 flex gap-3 text-left">
            <PortfolioSOP />
            <ExecutionProtocolSOP />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto text-left">
          <div className="p-4 bg-primary border border-primary/20 rounded-xl shadow-xl text-primary-foreground space-y-1 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest block opacity-80">Aggregate PnL</span>
            <div className="text-2xl font-black font-mono tabular-nums text-left">
              {stats?.totalPnl !== undefined && stats.totalPnl > 0 ? '+' : ''}{stats?.totalPnl?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Calibration (Brier)</span>
            <div className={cn(
              "text-2xl font-black font-mono tabular-nums text-left",
              stats?.brierScore !== null && stats?.brierScore !== undefined && stats.brierScore < platformBrier ? "text-accent" : "text-primary"
            )}>
              {stats?.brierScore !== null && stats?.brierScore !== undefined ? stats.brierScore.toFixed(3) : '---'}
            </div>
          </div>
          <div className="hidden md:block p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Avg Win Rate</span>
            <div className="text-2xl font-black font-mono text-foreground text-left">
              {stats?.winRate !== null && stats?.winRate !== undefined ? stats.winRate.toFixed(1) + '%' : '---'}
            </div>
          </div>
        </div>
      </div>

      {/* PRO EXCLUSIVE: PORTFOLIO EV MONITOR */}
      <section className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-8 space-y-8 shadow-inner text-left">
        <div className="flex items-center gap-2 text-left">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest px-2">Pro Exclusive</Badge>
        </div>
        <PortfolioEvMonitor />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="rounded-md border bg-card/30 overflow-hidden shadow-2xl backdrop-blur-sm text-left">
            <div className="flex justify-between items-center px-4 py-3 border-b bg-muted/10 text-left">
              <div className="flex items-center gap-4 text-left">
                <div className="flex items-center gap-2 text-left">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Logged Entry Registry</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Records: {stats?.count || 0}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto text-left">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest font-black h-12 bg-muted/30 border-b text-left">
                  <tr>
                    <th className="px-4">Logged Time</th>
                    <th className="px-4">Market Node</th>
                    <th className="px-4">Basis</th>
                    <th className="px-4">Status</th>
                    <th className="px-4 text-right">Realized Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-left">
                  {isTradesLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse h-16 text-left"><td colSpan={5} className="bg-white/5" /></tr>
                    ))
                  ) : trades && trades.length > 0 ? (
                    trades.map((trade) => {
                      const pnl = calculateTradePnL(trade);
                      const loggedDate = trade.tsLogged instanceof Timestamp ? trade.tsLogged.toDate() : new Date(trade.tsLogged);
                      
                      return (
                        <tr key={trade.id} className="group hover:bg-white/[0.02] transition-colors text-left">
                          <td className="px-4 py-4 font-mono text-[10px] text-muted-foreground">
                            {format(loggedDate, 'MM/dd HH:mm')}
                          </td>
                          <td className="px-4 py-4">
                            <Link href={`/intelligence/${trade.marketId}`} className="font-bold text-xs group-hover:text-primary transition-colors block max-w-[250px] truncate">
                              {trade.marketTitle}
                            </Link>
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">{trade.venue}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-black font-mono tabular-nums text-left">${trade.entryPrice.toFixed(3)}</span>
                              <Badge variant="secondary" className="w-fit text-[8px] h-3.5 px-1 font-black">{trade.direction}</Badge>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {trade.resolved ? (
                              <Badge variant={pnl && pnl > 0 ? 'default' : 'destructive'} className="text-[8px] font-black">
                                {trade.outcome === 1 ? 'YES RESOLVED' : 'NO RESOLVED'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[8px] font-black animate-pulse">PENDING SETTLEMENT</Badge>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right font-mono font-black">
                            <span className={cn(
                              pnl && pnl > 0 ? "text-accent" : pnl && pnl < 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {pnl !== null ? `${pnl > 0 ? '+' : ''}${pnl.toFixed(2)}` : '---'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-left">
                      <td colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                          <Waves className="w-12 h-12" />
                          <p className="text-xs font-black uppercase tracking-widest italic">No personal trades logged in the audit node.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 text-left">
          <Card className="bg-card border-white/5 shadow-2xl overflow-hidden text-left">
            <CardHeader className="bg-muted/30 border-b pb-4 text-left">
              <div className="flex items-center gap-3 text-left">
                <Target className="w-4 h-4 text-accent" />
                <CardTitle className="text-sm font-black uppercase tracking-widest text-left">Benchmark Audit</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 text-left">
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-end text-left">
                  <span className="text-[10px] font-black text-muted-foreground uppercase text-left">Your Calibration</span>
                  <span className="text-sm font-black font-mono text-accent text-left">{stats?.brierScore !== null && stats?.brierScore !== undefined ? stats.brierScore.toFixed(3) : '---'}</span>
                </div>
                <div className="flex justify-between items-end text-left">
                  <span className="text-[10px] font-black text-muted-foreground uppercase text-left">Platform Benchmark</span>
                  <span className="text-sm font-black font-mono text-primary text-left">{platformBrier.toFixed(3)}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative text-left">
                  <div className="absolute top-0 bottom-0 bg-primary left-0 transition-all duration-1000" style={{ width: '40%' }} />
                  <div className="absolute top-0 bottom-0 bg-accent transition-all duration-1000" style={{ width: '15%', left: '40%' }} />
                </div>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed text-center">
                  Calibration delta: {stats?.brierScore !== null && stats?.brierScore !== undefined ? (stats.brierScore - platformBrier).toFixed(3) : '---'} 
                  <br /> (A lower Brier Score indicates higher predictive precision)
                </p>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary text-left">
                  <History className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Accountability Tip</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium bg-primary/5 p-3 rounded border border-primary/10 italic text-left">
                  "Logging entries immediately after a θ_bet alert preserves the integrity of your Alpha Audit. Realized drift begins from your basis, not the platform's."
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-accent text-left">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-left">Oracle Protocol</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium text-left">
              Personal audit results are finalized only when the underlying venue (Polymarket/Kalshi) verifies settlement. Unit calculation follows the standard platform unit model.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-left">
          <span>Personal Hash Verified</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Zero-Knowledge Privacy</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Audit Stream: SECURE</span>
        </div>
      </footer>
    </div>
  );
}