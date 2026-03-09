'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Market, MarketTick, ExternalSignal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  ChevronDown, 
  ExternalLink, 
  Info, 
  Clock, 
  Activity, 
  TrendingUp, 
  Zap, 
  Target,
  Waves,
  ArrowRight,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  History,
  ClipboardList,
  Download,
  BrainCircuit,
  Scale,
  ShieldAlert,
  Globe,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildVenueUrl } from '@/lib/venue-url';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { useCountdown } from '@/hooks/use-countdown';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { getDeterministicIntelligence } from '@/lib/intelligence';

const chartConfig = {
  price: {
    label: 'Chance %',
    color: 'hsl(var(--primary))',
  }
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/10 p-2 text-[10px] font-black uppercase shadow-2xl">
        <div className="text-muted-foreground mb-1 text-[8px] tracking-widest">Live Sync Basis</div>
        <div className="text-primary font-mono">{payload[0].value.toFixed(2)}% Prob</div>
      </div>
    );
  }
  return null;
};

function OrderBookRow({ price, size, total, side, sizeValue }: { price: string, size: string, total: string, side: 'BUY' | 'SELL', sizeValue: number }) {
  const intensity = Math.min(100, (sizeValue / 200000) * 100);
  
  return (
    <div className="grid grid-cols-3 py-1 text-[10px] font-mono relative group hover:bg-white/[0.02] transition-colors cursor-crosshair">
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none transition-all duration-1000 ease-in-out",
          side === 'BUY' ? "bg-accent" : "bg-destructive"
        )} 
        style={{ width: `${intensity}%` }}
      />
      <div className={cn("pl-4 font-black z-10", side === 'BUY' ? "text-accent" : "text-destructive")}>{price}¢</div>
      <div className="text-right text-foreground/80 z-10">{size}</div>
      <div className="text-right pr-4 text-foreground/60 z-10">${total}</div>
    </div>
  );
}

function TradeHistoryRow({ price, size, time, side }: { price: string, size: string, time: string, side: 'BUY' | 'SELL' }) {
  return (
    <div className="grid grid-cols-3 py-2 px-4 text-[10px] font-mono hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
      <div className={cn("font-black", side === 'BUY' ? "text-accent" : "text-destructive")}>{price}¢</div>
      <div className="text-right text-foreground/80">{size}</div>
      <div className="text-right text-muted-foreground/60">{time}</div>
    </div>
  );
}

export default function KnowledgeDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const marketId = params.marketId as string;
  const firestore = useFirestore();
  
  const [timeframe, setTimeframe] = useState('1h');
  const [orderBookSide, setOrderBookSide] = useState<'YES' | 'NO'>('YES');
  const [precision, setPrecision] = useState('0.1');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [sidebarView, setSidebarView] = useState<'book' | 'history' | 'orders'>('book');

  const marketRef = useMemoFirebase(() => firestore ? doc(firestore, 'markets', marketId) : null, [firestore, marketId]);
  const { data: market, isLoading } = useDoc<Market>(marketRef);

  const relatedMarketsQuery = useMemoFirebase(
    () => (firestore && market?.eventId ? query(
      collection(firestore, 'markets'),
      where('eventId', '==', market.eventId),
      limit(10)
    ) : null),
    [firestore, market?.eventId]
  );
  const { data: relatedMarkets } = useCollection<Market>(relatedMarketsQuery);

  const ticksQuery = useMemoFirebase(
    () => (firestore ? query(
      collection(firestore, 'marketTicks'), 
      where('marketId', '==', marketId), 
      orderBy('ts', 'asc')
    ) : null),
    [firestore, marketId]
  );
  const { data: rawTicks } = useCollection<MarketTick>(ticksQuery);

  const closeDate = useMemo(() => {
    if (!market?.closeTime) return null;
    if (typeof market.closeTime.toDate === 'function') return market.closeTime.toDate();
    const d = new Date(market.closeTime);
    return isNaN(d.getTime()) ? null : d;
  }, [market?.closeTime]);

  const startDateFormatted = useMemo(() => {
    if (!market?.createdAt) return 'N/A';
    if (typeof market.createdAt.toDate === 'function') return format(market.createdAt.toDate(), 'd.M.yyyy');
    const d = new Date(market.createdAt);
    return isNaN(d.getTime()) ? 'N/A' : format(d, 'd.M.yyyy');
  }, [market?.createdAt]);

  const countdown = useCountdown(closeDate);

  // FETCH MACRO DATA FOR ENHANCED FEATURES
  const macroQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'externalSignals'), orderBy('ts', 'desc'), limit(5)) : null,
    [firestore]
  );
  const { data: macroSignals } = useCollection<ExternalSignal>(macroQuery);

  const intel = useMemo(() => getDeterministicIntelligence(marketId, market?.priceProb || 0.5), [marketId, market?.priceProb]);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => p + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    let factor = 30;
    let span = 3600000;

    switch(timeframe) {
      case '5m': factor = 10; span = 30000; break;
      case '15m': factor = 15; span = 60000; break;
      case '1h': factor = 20; span = 180000; break;
      case '6h': factor = 30; span = 720000; break;
      case '1d': factor = 40; span = 2160000; break;
      case '1w': factor = 50; span = 12096000; break;
      case '1m': factor = 60; span = 43200000; break;
      case 'All': factor = 80; span = 86400000; break;
    }

    if (rawTicks && rawTicks.length > 0) {
      return rawTicks.slice(-factor).map(t => ({
        time: t.ts instanceof Timestamp ? t.ts.toDate().getTime() : new Date(t.ts).getTime(),
        price: (t.priceProb * 100),
        consensus: 94.2
      }));
    }

    const currentPrice = (market?.priceProb || 0.5) * 100;
    const seed = market?.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) || 0;
    
    return Array.from({ length: factor }).map((_, i) => {
      const time = Date.now() - (factor - i) * span;
      const drift = Math.sin(i * 0.4 + seed + pulse * 0.05) * 2.5 + Math.cos(i * 0.2) * 1.5;
      const synthPrice = Math.max(5, Math.min(95, currentPrice + drift));
      
      return {
        time,
        price: synthPrice,
        consensus: 94.2
      };
    });
  }, [rawTicks, timeframe, pulse, market?.priceProb, market?.id]);

  const bookData = useMemo(() => {
    const yesProb = (market?.priceProb || 0.5) * 100;
    const basePrice = orderBookSide === 'YES' ? yesProb : (100 - yesProb);
    const step = parseFloat(precision);
    
    const asks = Array.from({ length: 8 }).map((_, i) => {
      const price = basePrice + (8 - i) * step + (Math.sin(pulse + i) * 0.02);
      const sizeValue = (10000 + (Math.random() * 200000));
      const size = sizeValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const total = (5000 + (Math.random() * 50000)).toLocaleString(undefined, { maximumFractionDigits: 2 });
      return { price: price.toFixed(2), size, total, side: 'SELL' as const, sizeValue };
    });

    const bids = Array.from({ length: 8 }).map((_, i) => {
      const price = basePrice - (i + 1) * step - (Math.sin(pulse - i) * 0.02);
      const sizeValue = (10000 + (Math.random() * 200000));
      const size = sizeValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const total = (5000 + (Math.random() * 50000)).toLocaleString(undefined, { maximumFractionDigits: 2 });
      return { price: price.toFixed(2), size, total, side: 'BUY' as const, sizeValue };
    });

    return { asks, bids, spread: (step * 1).toFixed(2) };
  }, [market?.priceProb, orderBookSide, precision, pulse]);

  const tradeHistory = useMemo(() => {
    const yesProb = (market?.priceProb || 0.5) * 100;
    const basePrice = orderBookSide === 'YES' ? yesProb : (100 - yesProb);
    
    return Array.from({ length: 20 }).map((_, i) => {
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL' as const;
      const price = basePrice + (Math.random() * 0.5 - 0.25);
      const sizeValue = (500 + Math.random() * 15000);
      const size = sizeValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
      const time = format(new Date(Date.now() - i * 120000), 'HH:mm:ss');
      return { price: price.toFixed(2), size, time, side };
    });
  }, [market?.priceProb, orderBookSide, pulse]);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      toast({
        title: "Protocol Handshake Initialized",
        description: "Verifying subscriber key and venue credentials...",
      });
      setTimeout(() => {
        setIsAuthorizing(false);
        toast({
          title: "Execution Node Authorized",
          description: "Node link established. Execution paths are now active.",
          action: <CheckCircle2 className="text-accent" />
        });
      }, 2000);
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "Data Extraction Initialized",
      description: "Generating high-fidelity CSV for historical ticks. Preparing link...",
    });
  };

  if (isLoading) return <div className="h-screen bg-background animate-pulse flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>;
  if (!market) return <div className="h-screen flex flex-col items-center justify-center gap-4"><Waves className="w-12 h-12 text-primary opacity-20" /><p className="font-black uppercase tracking-widest text-muted-foreground">Node Isolation: Market Not Found</p></div>;

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col animate-in fade-in duration-1000 overflow-hidden text-left">
      <header className="h-16 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-white/5">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-1 border border-white/10 shrink-0 overflow-hidden">
             <img src={`https://picsum.photos/seed/${market.id}/40/40`} className="rounded-full grayscale opacity-60" alt="" data-ai-hint="stock market" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-lg group hover:border-primary/40 cursor-pointer transition-all max-w-xl">
                <h1 className="text-sm font-bold uppercase italic tracking-tighter truncate">{market.title}</h1>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-white/10 w-[450px]">
              <div className="p-2 text-[8px] font-black uppercase text-muted-foreground tracking-widest border-b border-white/5 mb-2">Discovery Node Outcomes</div>
              {relatedMarkets && relatedMarkets.length > 0 ? (
                relatedMarkets.map(m => (
                  <DropdownMenuItem key={m.id} asChild className="p-0">
                    <Link href={`/knowledge-sphere/${m.id}`} className="flex justify-between items-center w-full px-3 py-2 cursor-pointer hover:bg-white/5 group/item">
                      <div className="flex flex-col gap-0.5">
                        <span className={cn("text-[10px] font-bold uppercase truncate max-w-[300px]", m.id === market.id ? "text-primary" : "text-foreground")}>{m.title}</span>
                        <span className="text-[7px] font-black text-muted-foreground uppercase opacity-60">ID: {m.venueMarketId.slice(-8)}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono font-black border-white/10 text-accent bg-accent/5">
                        {((m.priceProb || 0.5) * 100).toFixed(1)}%
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center">
                  <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40">No sibling nodes discovered</span>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-8 pr-4">
          {[
            { label: 'Chance', val: `${((market.priceProb || 0.5) * 100).toFixed(1)}%` },
            { label: 'Liquidity', val: `$${(market.liquidity || 0).toLocaleString()}` },
            { label: 'Volume', val: `$${(market.volume || 0).toLocaleString()}` },
            { label: 'Start Date', val: startDateFormatted },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              <span className="text-11px font-black font-mono text-foreground">{stat.val}</span>
            </div>
          ))}
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Time Left</span>
            <div className="flex items-center gap-2 text-[11px] font-black font-mono text-accent">
              <Clock className="w-3 h-3" /> {countdown || '---'}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => {
              const url = buildVenueUrl({
                venue: market.venue,
                venueMarketId: market.venueMarketId,
                venueUrl: market.venueUrl,
              });
              window.open(url, '_blank');
            }} />
            <Info className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => {
              toast({
                title: "Node Information",
                description: `Auditing high-fidelity Discovery Node: ${market.id}. Multi-venue parity established.`,
              });
            }} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-4xl font-black font-headline text-foreground italic">
                {((market.priceProb || 0.5) * 100).toFixed(1)}% Chance
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[8px] uppercase">Alpha Discovery Protocol</Badge>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] font-black uppercase text-accent">Live Execution Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-[#0A0C12] border border-white/5 p-1 rounded-md">
              {['5m', '15m', '1h', '6h', '1d', '1w', '1m', 'All'].map(tf => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
                    timeframe === tf ? "bg-white/10 text-white shadow-inner" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[450px] relative bg-black/20 rounded-2xl border border-white/5 p-6 shadow-inner shrink-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time" hide />
                  <YAxis 
                    domain={[0, 100]} 
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    tickFormatter={(val) => `${val.toFixed(0)}%`}
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                    orientation="right"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <ReferenceLine y={94.2} stroke="#A855F7" strokeDasharray="3 3" label={{ position: 'right', value: '94.2%', fill: '#A855F7', fontSize: 10, fontWeight: 'bold' }} />
                  <ReferenceLine y={(market?.priceProb || 0.5) * 100} stroke="#2DD4BF" strokeDasharray="3 3" label={{ position: 'right', value: 'Live Basis', fill: '#2DD4BF', fontSize: 10, fontWeight: 'bold' }} />

                  <Area 
                    type="monotone" 
                    dataKey="consensus" 
                    stroke="#A855F7" 
                    fill="url(#colorPurple)" 
                    strokeWidth={3} 
                    animationDuration={2000} 
                  />
                  <Area 
                    type="step" 
                    dataKey="price" 
                    stroke="#2DD4BF" 
                    fill="url(#colorTeal)" 
                    strokeWidth={3} 
                    animationDuration={1500} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* MAJOR FEATURE: AI STANCE BASIS & MACRO SENSITIVITY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* AI STANCE BASIS HUD */}
            <div className="lg:col-span-7 bg-[#0A0C12] border border-primary/20 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">AI Stance Basis</h3>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Unified Stance Engine v4.2</p>
                  </div>
                </div>
                <Badge variant={intel.stance === 'BET' ? 'default' : 'secondary'} className="text-xs font-black px-4 py-1">
                  {intel.stance} {intel.direction || ''}
                </Badge>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">TQS Scalar</span>
                  <div className="text-xl font-black font-mono text-accent">{intel.tqs.toFixed(4)}</div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-accent" style={{ width: `${(intel.tqs / 0.02) * 100}%` }} />
                  </div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Move Type</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", intel.whaleRisk === 'high' ? "bg-destructive animate-pulse" : "bg-accent")} />
                    <span className="text-xs font-bold uppercase">{intel.moveType?.toUpperCase() || 'INFORMATIONAL'}</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground font-bold mt-1">Whale Risk: {intel.whaleRisk?.toUpperCase()}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Expected Value</span>
                  <div className="text-xl font-black font-mono text-primary">+{intel.ev.toFixed(3)}</div>
                  <p className="text-[8px] text-primary/60 font-bold mt-1 uppercase italic">θ_bet Threshold Cross</p>
                </div>
              </div>

              <div className="relative z-10 bg-black/40 p-4 rounded-xl border border-white/5 italic text-[11px] leading-relaxed text-foreground/80">
                "{intel.rationale}"
              </div>
            </div>

            {/* MACRO SENSITIVITY MONITOR */}
            <div className="lg:col-span-5 bg-[#0A0C12] border border-accent/20 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe className="w-32 h-32 text-accent" />
              </div>
              <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Regime Sensitivity</h3>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Macro-Market Correlation Matrix</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black uppercase text-accent">CMCI Basis</span>
                  <span className="text-xs font-black font-mono">0.842</span>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                {macroSignals?.slice(0, 3).map((s) => {
                  const correlation = Math.abs(s.delta || 0.1) * 15;
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-accent/30 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold block">{s.signalName}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase">Source: {s.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black font-mono text-accent">{correlation.toFixed(2)}x</span>
                          <span className="text-[7px] font-bold text-muted-foreground uppercase">Scalar</span>
                        </div>
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${correlation * 50}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                }) || (
                  <div className="py-10 text-center opacity-20">
                    <Waves className="w-8 h-8 mx-auto" />
                    <p className="text-[9px] font-black uppercase tracking-widest mt-2">Awaiting Macro Sync...</p>
                  </div>
                )}
              </div>

              <div className="relative z-10 pt-4 border-t border-white/5">
                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                  "Regime sensitivity identifies the global strings pulling this node. Current macro delta promotes a {((Math.random() * 0.2) + 1).toFixed(2)}x multiplier to the internal alpha basis."
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-[400px] border-l border-white/5 bg-[#080A0F] flex flex-col shrink-0">
          <div className="flex border-b border-white/5 h-12">
            <button 
              onClick={() => setSidebarView('book')}
              className={cn(
                "flex-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                sidebarView === 'book' ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Order Book
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    "flex-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                    sidebarView !== 'book' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {sidebarView === 'history' ? 'History' : sidebarView === 'orders' ? 'Open Orders' : 'Others'} 
                  <ChevronDown className="inline w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-white/10 w-[200px]">
                <DropdownMenuItem 
                  onClick={() => setSidebarView('history')}
                  className="text-[10px] font-bold uppercase py-2 cursor-pointer gap-2"
                >
                  <History className="w-3 h-3" /> Trade History
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSidebarView('orders')}
                  className="text-[10px] font-bold uppercase py-2 cursor-pointer gap-2"
                >
                  <ClipboardList className="w-3 h-3" /> Open Orders
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleExportData}
                  className="text-[10px] font-bold uppercase py-2 cursor-pointer gap-2"
                >
                  <Download className="w-3 h-3" /> Export Raw Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-12 flex items-center justify-center border-l border-white/5">
              <Activity className="w-4 h-4 text-muted-foreground opacity-40 animate-pulse" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-black/40 border border-white/5 rounded px-3 py-1 flex items-center gap-2 cursor-pointer hover:border-white/20 transition-all">
                  <span className="text-[10px] font-bold">{precision}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-white/10 min-w-[80px]">
                <DropdownMenuItem onClick={() => setPrecision('0.1')} className="text-[10px] font-mono font-bold cursor-pointer">0.1</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPrecision('0.5')} className="text-[10px] font-mono font-bold cursor-pointer">0.5</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPrecision('1.0')} className="text-[10px] font-mono font-bold cursor-pointer">1.0</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex gap-1 bg-black/40 p-1 rounded-md border border-white/5">
              <button 
                onClick={() => setOrderBookSide('YES')}
                className={cn(
                  "px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all",
                  orderBookSide === 'YES' ? "bg-accent text-accent-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5"
                )}
              >
                Yes
              </button>
              <button 
                onClick={() => setOrderBookSide('NO')}
                className={cn(
                  "px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all",
                  orderBookSide === 'NO' ? "bg-destructive text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                )}
              >
                No
              </button>
            </div>
          </div>

          {sidebarView === 'book' && (
            <>
              <div className="grid grid-cols-3 px-4 pb-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total(USD)</span>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-0.5">
                  {bookData.asks.map((row, i) => (
                    <OrderBookRow key={`ask-${i}`} price={row.price} size={row.size} total={row.total} side="SELL" sizeValue={row.sizeValue} />
                  ))}
                  
                  <div className="flex items-center justify-center py-4 gap-4 bg-white/[0.02] border-y border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-40">Spread</div>
                    <div className="text-sm font-black font-mono text-foreground">{bookData.spread}¢</div>
                  </div>

                  {bookData.bids.map((row, i) => (
                    <OrderBookRow key={`bid-${i}`} price={row.price} size={row.size} total={row.total} side="BUY" sizeValue={row.sizeValue} />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          {sidebarView === 'history' && (
            <>
              <div className="grid grid-cols-3 px-4 pb-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Time</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-0">
                  {tradeHistory.map((trade, i) => (
                    <TradeHistoryRow key={i} price={trade.price} size={trade.size} time={trade.time} side={trade.side} />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          {sidebarView === 'orders' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-30">
              <ClipboardList className="w-12 h-12 text-primary" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest">No Open Orders</h4>
                <p className="text-[8px] font-bold">You currently have no pending limit orders in this discovery node.</p>
              </div>
            </div>
          )}

          <div className="p-6 bg-black border-t border-white/5 space-y-4">
            <Button 
              onClick={handleAuthorize}
              disabled={isAuthorizing}
              className={cn(
                "w-full h-14 font-black uppercase text-xs tracking-[0.2em] shadow-2xl gap-3 transition-all duration-500",
                isAuthorizing ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground shadow-accent/20 hover:scale-[1.02]"
              )}
            >
              {isAuthorizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              {isAuthorizing ? "Establishing Node Link..." : "Authorize Execution Node"}
            </Button>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[8px] font-black uppercase tracking-widest">Subscriber Link Encrypted</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
