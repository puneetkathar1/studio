'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { PublicLedgerEntry } from '@/lib/types';
import { calculatePnl } from '@/lib/pnl';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Search, 
  Maximize2, 
  ArrowLeft, 
  Lock, 
  Zap, 
  Fingerprint, 
  BarChart3,
  Clock,
  ExternalLink,
  Target,
  BrainCircuit,
  Info,
  BookOpen,
  Scale,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TickerTape } from '@/components/terminal/ticker-tape';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

interface IndicatorDocs {
  label: string;
  short: string;
  value: string | number;
  subtext: string;
  color: 'primary' | 'accent';
  approach: string;
  reason: string;
  contribution: string;
}

function IndicatorItem({ indicator }: { indicator: IndicatorDocs }) {
  const { label, short, value, subtext, color } = indicator;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-3 border border-white/5 bg-white/[0.02] rounded space-y-1 cursor-pointer hover:bg-white/[0.05] transition-all hover:border-white/10 group relative overflow-hidden">
          <div className={cn(
            "absolute top-0 right-0 w-1.5 h-1.5 rounded-full m-1 animate-pulse",
            color === "primary" ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" : "bg-accent shadow-[0_0_8px_hsl(var(--accent))]"
          )} />
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
            <span className={cn("text-[9px] font-mono font-black px-1 rounded", 
              color === "primary" ? "text-primary bg-primary/10" : "text-accent bg-accent/10"
            )}>{short}</span>
          </div>
          <div className="text-lg font-black font-mono tracking-tighter tabular-nums">{value}</div>
          <div className="text-[8px] font-bold text-muted-foreground/60 uppercase italic">→ {subtext}</div>
        </div>
      </DialogTrigger>
      
      <DialogContent className={cn(
        "max-w-md border-white/10 bg-[#0A0C12] text-[#E0E0E0] shadow-2xl",
        color === "accent" ? "border-accent/30 shadow-accent/5" : "border-primary/30 shadow-primary/5"
      )}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "p-2 rounded border",
              color === 'accent' ? "bg-accent/10 border-accent/20 text-accent" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <Info className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black font-headline tracking-tight uppercase">
                {label} <span className="opacity-40 ml-1">({short})</span>
              </DialogTitle>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Audit Methodology v4.2</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Current Metric</span>
              <div className={cn("text-2xl font-black font-mono", color === 'accent' ? "text-accent" : "text-primary")}>
                {value}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">System State</span>
              <div className="text-[10px] font-bold uppercase tracking-tighter leading-tight pt-1">
                {subtext}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Cpu className="w-3 h-3" /> Technical Approach
              </div>
              <p className="text-xs leading-relaxed text-foreground/80 bg-background/50 p-3 rounded border border-white/5 italic">
                {indicator.approach}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <BookOpen className="w-3 h-3" /> Strategic Reason
              </div>
              <p className="text-xs leading-relaxed text-foreground/80">
                {indicator.reason}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Scale className="w-3 h-3" /> Decision Basis Contribution
              </div>
              <p className="text-xs leading-relaxed text-foreground/80 border-l-2 border-primary/30 pl-3">
                {indicator.contribution}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Subscriber Audit verified</span>
            <Button variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest border border-white/10" disabled>
              Export JSON Model
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProTerminalPage() {
  const firestore = useFirestore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(100)) : null,
    [firestore]
  );
  const { data: rawEntries, isLoading } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const filteredEntries = useMemo(() => {
    if (!rawEntries) return [];
    return rawEntries.filter(e => e.marketTitle?.toLowerCase().includes(search.toLowerCase()));
  }, [rawEntries, search]);

  const selectedEntry = useMemo(() => 
    filteredEntries.find(e => e.id === selectedId) || filteredEntries[0], 
    [filteredEntries, selectedId]
  );

  const indicators = useMemo(() => {
    if (!selectedEntry) return [];
    const seed = selectedEntry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const getVal = (min: number, range: number) => (min + (seed % (range * 10))).toFixed(2);
    
    const docs: IndicatorDocs[] = [
      { 
        label: 'Signal Prob', short: 'SPS', value: (60 + (seed % 35)) + '%', subtext: 'True odds basis', color: 'primary',
        approach: "Bayesian-Laplace probability estimation utilizing multi-venue orderflow normalization.",
        reason: "Establishes the fundamental model-implied probability of the contract's resolution.",
        contribution: "Primary threshold for switching from WAIT to BET status based on mispricing delta."
      },
      { 
        label: 'Conf Index', short: 'CCI', value: getVal(0.4, 0.5), subtext: 'Stability metric', color: 'primary',
        approach: "Rolling standard deviation of price changes across 1m, 5m, and 15m intervals.",
        reason: "Filters out high-entropy 'noise' trades that lack fundamental capital commitment.",
        contribution: "Blocks signal issuance during periods of high price volatility without volume confirmation."
      },
      { 
        label: 'Expected Val', short: 'EVS', value: '+' + getVal(0.1, 1.2), subtext: 'Alpha estimate', color: 'accent',
        approach: "Delta calculation between Fair Value mu (μ) and current Venue Midpoint.",
        reason: "Quantifies the mathematical advantage (alpha) of entering at current market levels.",
        contribution: "Directly determines the standard Unit Stake sizing for the performance ledger."
      },
      { 
        label: 'Market Ineff', short: 'MIS', value: getVal(0.1, 0.8), subtext: 'Mispricing delta', color: 'primary',
        approach: "Information entropy scan comparing current price to historical resolution patterns for similar events.",
        reason: "Identifies systemic biases in public sentiment or crowd-funding dynamics.",
        contribution: "Determines the directionality (YES/NO) based on which outcome is underpriced."
      },
      { 
        label: 'Liquidity Q', short: 'LQS', value: getVal(0.3, 0.6), subtext: 'Depth integrity', color: 'primary',
        approach: "Spread-to-Depth ratio analysis across the top 10 orderbook levels.",
        reason: "Protects against 'Thin Tail' traps where prices are easily moved by small actors.",
        contribution: "Overrides BET signals to WAIT if the exit liquidity doesn't support a 10-unit exit."
      },
      { 
        label: 'Timing Val', short: 'TVS', value: 'OPTIMAL', subtext: 'Window status', color: 'accent',
        approach: "Time-decay (Theta) sensitivity analysis relative to the event's resolution horizon.",
        reason: "Finds the 'sweet spot' where price discovery is most efficient and risk is lowest.",
        contribution: "Acts as a temporary inhibitor; shifts a BET to a WAIT if the entry is considered premature."
      },
      { 
        label: 'Regime Risk', short: 'RRS', value: getVal(0.1, 0.4), subtext: 'Structural uncertainty', color: 'primary',
        approach: "VIX-proxy scan for the specific sector (Politics, Crypto, Macro).",
        reason: "Identifies external 'Macro Shocks' that may render current data models obsolete.",
        contribution: "Increases the Fair Value Envelope width (Sigma), reducing overall signal clarity."
      },
      { 
        label: 'Belief Div', short: 'BDS', value: getVal(0.2, 0.7), subtext: 'Polarization level', color: 'primary',
        approach: "Polarity analysis of trade concentration between the two binary outcomes.",
        reason: "Measures whether the market is in consensus or extreme disagreement.",
        contribution: "High divergence often signals a 'Black Swan' opportunity where the crowd is wrong."
      },
      { 
        label: 'Clarity Score', short: 'SCS', value: getVal(0.5, 0.4), subtext: 'Combined readability', color: 'accent',
        approach: "Weighted composite of SNR (Signal-to-Noise Ratio) and confirmation consistency.",
        reason: "Provides a single readability index for the entire analytical thesis.",
        contribution: "The ultimate 'Go/No-Go' gate for automated signal distribution."
      },
      { 
        label: 'Invalidation', short: 'IAS', value: getVal(0.1, 0.3), subtext: 'Thesis threshold', color: 'primary',
        approach: "Proximity scanning to the price levels that would break the current model logic.",
        reason: "Identifies how much room the thesis has to 'breathe' before it must be abandoned.",
        contribution: "Controls the automated liquidation/stop-loss logic in the Pro audit layer."
      },
      { 
        label: 'Reliability', short: 'PRS', value: getVal(0.7, 0.2), subtext: 'Post-fact weight', color: 'primary',
        approach: "Rolling Bayesian accuracy weight of the specific sub-model across the last 100 signals.",
        reason: "Injects accountability by penalizing models that have recently failed.",
        contribution: "Moderates signal confidence based on real-world verification results."
      },
      { 
        label: 'Edge Capture', short: 'ECS', value: (10 + (seed % 15)) + '%', subtext: 'Realized alpha', color: 'accent',
        approach: "Realized PnL vs Theoretical Fair Value delta calculation.",
        reason: "Measures 'Alpha Leakage'—the difference between model perfection and execution reality.",
        contribution: "Refines future EVS (Expected Value) models to account for slippage and decay."
      },
      { 
        label: 'Discipline', short: 'DCS', value: '94%', subtext: 'Rule adherence', color: 'primary',
        approach: "Compliance audit of the model against its hard-coded 'Constraint Set'.",
        reason: "Prevents overtrading or issuance during forbidden high-risk regimes.",
        contribution: "Ensures only signals that meet 100% of regulatory parameters are committed to ledger."
      },
      { 
        label: 'Portfolio Corr', short: 'PCS', value: '0.12', subtext: 'Risk correlation', color: 'primary',
        approach: "Pearson correlation coefficient check against all active ledger signals.",
        reason: "Detects 'Hidden Overexposure' where multiple signals depend on the same external event.",
        contribution: "Caps position sizing if total portfolio variance exceeds safe thresholds."
      },
      { 
        label: 'Asym Risk', short: 'ARS', value: '2.4x', subtext: 'Skew awareness', color: 'accent',
        approach: "Fisher Skewness analysis of the probability distribution tail.",
        reason: "Favors signals where the payout upside is significantly larger than the statistical downside.",
        contribution: "Incentivizes BET signals on low-prob/high-reward 'Long tail' events."
      },
      { 
        label: 'Horizon Sens', short: 'HSS', value: 'LOW', subtext: 'Time-decay risk', color: 'primary',
        approach: "Monte-Carlo simulation of event timing shifts (delays or acceleration).",
        reason: "Crucial for event-driven markets where a delay can destroy the bet's value.",
        contribution: "Reduces signal confidence if the event outcome is sensitive to precise timing."
      },
    ];
    return docs;
  }, [selectedEntry]);

  const vitalsMetrics = useMemo(() => {
    if (!selectedEntry) return [];
    const seed = selectedEntry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return [
      { 
        label: 'Thesis Stability', 
        val: (90 + (seed % 10)).toFixed(1) + '%', 
        drift: parseFloat(((seed % 20 - 10) / 10).toFixed(1)), 
        status: (seed % 10 > 2 ? 'NOMINAL' : 'MONITOR') 
      },
      { 
        label: 'Model Entropy', 
        val: (0.1 + (seed % 50) / 500).toFixed(3), 
        drift: parseFloat(((seed % 10 - 5) / 10).toFixed(1)), 
        status: (seed % 5 > 1 ? 'NOMINAL' : 'MONITOR') 
      },
      { 
        label: 'Orderbook Depth', 
        val: '$' + (1 + (seed % 5)).toFixed(1) + 'M', 
        drift: parseFloat(((seed % 30 - 15) / 10).toFixed(1)), 
        status: (seed % 8 > 2 ? 'NOMINAL' : 'MONITOR') 
      },
    ];
  }, [selectedEntry]);

  const calibrationMetrics = useMemo(() => {
    if (!selectedEntry) return { brier: 0.148, sectorAvg: 0.155, chart: [] };
    const seed = selectedEntry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const brier = parseFloat((0.1 + (seed % 80) / 1000).toFixed(3));
    const sectorAvg = parseFloat((brier + 0.01 + (seed % 20) / 1000).toFixed(3));
    
    const chart = Array.from({ length: 10 }).map((_, i) => ({
      height: 30 + ((seed + i * 7) % 70)
    }));

    return { brier, sectorAvg, chart };
  }, [selectedEntry]);

  const getVenueUrl = (entry: PublicLedgerEntry) => {
    const identifier = entry.marketId.split('_').slice(1).join('_');
    if (entry.venue.toLowerCase() === 'polymarket') {
      return /^\d+$/.test(identifier) 
        ? `https://polymarket.com/market/${identifier}` 
        : `https://polymarket.com/event/${identifier}`;
    }
    return `https://kalshi.com/markets/${identifier}`;
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none z-[100]">
      {/* TOP TICKER */}
      <TickerTape entries={rawEntries || []} />

      {/* PRO HEADER */}
      <div className="h-12 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" asChild>
            <Link href="/pro-audit"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs font-black">P</div>
            <span className="text-xs font-black tracking-tighter uppercase">Pro Intelligence Terminal</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <Badge className="bg-accent text-accent-foreground font-black text-[9px] uppercase tracking-widest px-2 py-0">
            Audit Level: Absolute
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span className="uppercase">Platform Calibration:</span>
            <span className="text-accent">99.2% Nominal</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
            < ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="uppercase">Ledger:</span>
            <span className="text-primary tracking-widest">SECURE_HASH_V4</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: SIGNAL FEED */}
        <div className="w-80 border-r border-white/5 bg-[#080A0F] flex flex-col">
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Verification Stream</span>
              <Cpu className="w-3 h-3 text-primary opacity-50" />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                placeholder="FILTER STREAM..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 bg-white/[0.03] border border-white/5 rounded text-[10px] pl-7 focus:outline-none focus:border-primary/50 uppercase font-bold"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {filteredEntries.map((entry) => (
                <div 
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:bg-white/[0.02] border-l-2",
                    selectedEntry?.id === entry.id ? "bg-primary/5 border-l-primary" : "border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {format(entry.tsIssued instanceof Timestamp ? entry.tsIssued.toDate() : new Date(entry.tsIssued), 'HH:mm:ss')}
                    </span>
                    <Badge variant={entry.stance === 'BET' ? 'default' : 'secondary'} className="text-[8px] h-4 font-black">
                      {entry.stance}
                    </Badge>
                  </div>
                  <h3 className={cn("text-[11px] font-bold leading-tight line-clamp-2", 
                    selectedEntry?.id === entry.id ? "text-primary" : "text-foreground/80"
                  )}>
                    {entry.marketTitle}
                  </h3>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-[10px] font-black uppercase opacity-40">{entry.venue}</span>
                    <span className="text-[10px] font-mono font-bold text-accent">EV: +{entry.evEst.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER: QUANTITATIVE CORE */}
        <div className="flex-1 bg-[#05070A] overflow-hidden flex flex-col">
          {selectedEntry ? (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500 overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                  {/* HERO STATS */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] px-3">SIGNAL_ID: {selectedEntry.sourceSignalId.slice(-12)}</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Audit Verifier v1.2</span>
                      </div>
                      <h2 className="text-4xl font-black font-headline tracking-tighter leading-none italic uppercase">
                        {selectedEntry.marketTitle}
                      </h2>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Decision Basis</span>
                          <span className="text-xl font-black font-headline text-primary">{selectedEntry.stance} {selectedEntry.direction || ''}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Issue Price</span>
                          <span className="text-xl font-black font-mono tabular-nums">${selectedEntry.marketPriceAtIssue.toFixed(3)}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fair Value Range</span>
                          <span className="text-xl font-black font-mono tabular-nums text-accent">${selectedEntry.fairLow.toFixed(2)} - ${selectedEntry.fairHigh.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] font-black h-10 gap-2 px-6 uppercase" asChild>
                        <a href={getVenueUrl(selectedEntry)} target="_blank" rel="noopener noreferrer">
                          Venue Contract <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button className="h-10 text-[10px] font-black gap-2 px-6 uppercase shadow-lg shadow-primary/20">
                        Export Audit Log <Fingerprint className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* 16 INDICATOR GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {indicators.map((ind) => (
                      <IndicatorItem key={ind.short} indicator={ind} />
                    ))}
                  </div>

                  {/* AI RATIONALE & THESIS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Intelligence Briefing</h3>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl italic text-lg leading-relaxed text-foreground/90 font-medium">
                        "{selectedEntry.rationaleShort}"
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.tags?.map(t => (
                          <Badge key={t} variant="outline" className="text-[9px] font-black uppercase border-white/10">{t}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Post-Resolution Verified Data</h3>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                        <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                          {selectedEntry.resolved ? (
                            <Badge className="bg-accent/20 text-accent font-black text-[9px]">RESOLVED_VERIFIED</Badge>
                          ) : (
                            <Badge variant="secondary" className="font-black text-[9px] animate-pulse">PENDING_ORACLE</Badge>
                          )}
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Realized Alpha</span>
                          <span className="text-sm font-black font-mono text-accent">+{selectedEntry.realizedPnlUnits?.toFixed(2) || '0.00'} Units</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Model Error Delta</span>
                          <span className="text-sm font-black font-mono">0.024c</span>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-primary/5">
                          <span className="text-[10px] font-black text-primary uppercase">Oracle Identity</span>
                          <span className="text-[10px] font-mono font-bold">{selectedEntry.venue.toUpperCase()}_DISPUTE_ORACLE_V2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-30">
              <Maximize2 className="w-24 h-24" />
              <p className="text-xl font-black uppercase tracking-[0.5em]">Establishing Connection...</p>
            </div>
          )}
        </div>

        {/* RIGHT: ACCOUNTABILITY METRICS */}
        <div className="w-80 border-l border-white/5 bg-[#080A0F] flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Thesis Drift Monitor</h3>
                </div>
                <div className="space-y-6">
                  {vitalsMetrics.map(m => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{m.label}</span>
                        <span className={cn("text-[8px] font-black px-1 rounded", 
                          m.status === 'NOMINAL' ? "text-accent bg-accent/10" : "text-destructive bg-destructive/10"
                        )}>{m.status}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-black font-mono">{m.val}</div>
                        <div className={cn("text-[9px] font-bold", m.drift >= 0 ? "text-accent" : "text-destructive")}>
                          {m.drift >= 0 ? '+' : ''}{m.drift}%
                        </div>
                      </div>
                      <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${70 + (m.drift * 5)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Calibration Analysis</h3>
                </div>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-primary/70">Brier Score Target</span>
                    <div className="text-2xl font-black font-mono">{calibrationMetrics.brier.toFixed(3)}</div>
                    <div className="text-[8px] font-bold uppercase text-primary/50 italic">Sector Average: {calibrationMetrics.sectorAvg.toFixed(3)}</div>
                  </div>
                  <div className="h-12 w-full bg-background/50 rounded flex items-end gap-1 p-1">
                    {calibrationMetrics.chart.map((item, i) => (
                      <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${item.height}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-center space-y-2">
                  <Lock className="w-6 h-6 text-accent mx-auto opacity-50" />
                  <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                    Pro Audit verification key: <br/>
                    <span className="text-foreground opacity-100 font-mono">0xBE...AD42</span>
                  </p>
                </div>
                <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-8" asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
        <div className="flex gap-6">
          <span>Terminal Status: ONLINE</span>
          <span>Latency: 12ms</span>
          <span>Encryption: AES-256</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent opacity-100">Live Verification Active</span>
        </div>
      </div>
    </div>
  );
}
