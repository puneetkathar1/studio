'use client';

import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { PublicLedgerEntry } from '@/lib/types';
import { calculatePnl } from '@/lib/pnl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Users, Target, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
  subtext,
}: {
  title: string;
  value: string;
  icon?: LucideIcon;
  isLoading: boolean;
  subtext: string;
}) => {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold font-headline">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export function DashboardStats() {
  const firestore = useFirestore();
  const ledgerQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'))
        : null,
    [firestore]
  );

  const { data: ledgerEntries, isLoading } =
    useCollection<PublicLedgerEntry>(ledgerQuery);

  const stats = useMemo(() => {
    if (!ledgerEntries || ledgerEntries.length === 0) {
      return {
        totalRealizedUnits: 0,
        winRate: 0,
        avoidedLosses: 0,
        proSignals: 0
      };
    }

    const resolvedBets = ledgerEntries.filter(
      (e) => e.stance === 'BET' && e.resolved
    );

    const totalRealizedUnits = ledgerEntries.reduce((acc, entry) => {
      const pnl = calculatePnl(entry);
      return acc + (pnl || 0);
    }, 0);

    const avoidedLossesCount = ledgerEntries.filter(
      (e) => e.stance === 'NO_BET' && e.resolved && e.outcome === 1
    ).length;

    const winningBetsCount = resolvedBets.filter((e) => {
      const pnl = calculatePnl(e);
      return pnl !== null && pnl > 0;
    }).length;

    const winRate = resolvedBets.length > 0 ? (winningBetsCount / resolvedBets.length) * 100 : 0;

    return {
      totalRealizedUnits,
      winRate,
      avoidedLosses: avoidedLossesCount,
      proSignals: ledgerEntries.length
    };
  }, [ledgerEntries]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Realized PnL"
        value={`${stats.totalRealizedUnits >= 0 ? '+' : ''}${stats.totalRealizedUnits.toFixed(2)} units`}
        icon={DollarSign}
        isLoading={isLoading}
        subtext="Unit-based performance"
      />
      <StatCard
        title="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        icon={Target}
        isLoading={isLoading}
        subtext={`Based on ${ledgerEntries?.filter(e => e.stance === 'BET' && e.resolved).length || 0} resolved bets`}
      />
      <StatCard
        title="Avoided Losses"
        value={stats.avoidedLosses.toString()}
        icon={ShieldCheck}
        isLoading={isLoading}
        subtext="Successful NO_BET signals"
      />
      <StatCard
        title="Total Signals"
        value={stats.proSignals.toString()}
        icon={Users}
        isLoading={isLoading}
        subtext="Immutable ledger entries"
      />
    </div>
  );
}
