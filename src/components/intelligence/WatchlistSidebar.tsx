
'use client';

import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp } from 'firebase/firestore';
import { WatchlistItem, Market, MarketState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { 
  Zap, 
  Trash2, 
  TrendingUp, 
  Activity, 
  Target, 
  ArrowUpRight,
  Bell,
  Loader2,
  Waves,
  Settings2,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDoc } from '@/firebase/firestore/use-doc';
import { AlertConfigDialog } from './AlertConfigDialog';

function WatchlistItemRow({ item, userId }: { item: WatchlistItem, userId: string }) {
  const firestore = useFirestore();
  const stateRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'marketState', item.marketId) : null),
    [firestore, item.marketId]
  );
  const { data: state, isLoading } = useDoc<MarketState>(stateRef);

  // Fetch full market metadata for the dialog
  const marketRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'markets', item.marketId) : null),
    [firestore, item.marketId]
  );
  const { data: market } = useDoc<Market>(marketRef);

  const tqs = state?.tqs || 0;
  const targetTqs = item.targetTqs || 0.02;
  const isTriggered = tqs >= targetTqs;

  return (
    <div className="group p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter opacity-50">{item.venue}</Badge>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {market && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-primary">
                  <Settings2 className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <AlertConfigDialog market={market} isWatched={true} />
            </Dialog>
          )}
        </div>
      </div>
      
      <h4 className="text-[11px] font-bold leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
        {item.title}
      </h4>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-black/20 rounded border border-white/5 space-y-0.5">
          <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest block">Floor</span>
          <div className="text-[10px] font-black font-mono text-primary">{targetTqs.toFixed(3)}</div>
        </div>
        <div className="p-2 bg-black/20 rounded border border-white/5 space-y-0.5">
          <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest block">Min Liq</span>
          <div className="text-[10px] font-black font-mono text-accent">${(item.minLiquidity / 1000000).toFixed(1)}M</div>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-white/5 pt-2">
        <div className="space-y-1">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Current TQS</span>
          <div className={cn(
            "text-sm font-black font-mono tracking-tighter",
            isTriggered ? "text-accent" : "text-primary"
          )}>
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : tqs.toFixed(4)}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Status</span>
          <Badge variant={isTriggered ? 'default' : 'secondary'} className={cn("text-[8px] h-4 font-black", isTriggered && "bg-accent text-accent-foreground")}>
            {isTriggered ? 'ALPHA CROSS' : 'MONITORING'}
          </Badge>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="w-full mt-2 h-6 text-[9px] font-black uppercase gap-1" asChild>
        <Link href={`/intelligence/${item.marketId}`}>
          Audit Journey <ArrowUpRight className="w-2.5 h-2.5" />
        </Link>
      </Button>
    </div>
  );
}

export function WatchlistSidebar() {
  const { user } = useUser();
  const firestore = useFirestore();

  const watchlistQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'users', user.uid, 'watchlist'), orderBy('createdAt', 'desc')) : null),
    [firestore, user]
  );
  const { data: watchlist, isLoading } = useCollection<WatchlistItem>(watchlistQuery);

  if (!user) return (
    <div className="p-6 text-center space-y-4 opacity-40">
      <Bell className="w-12 h-12 mx-auto" />
      <p className="text-[10px] uppercase font-black tracking-widest">Connect account to track alpha triggers</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#080A0F]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">θ_bet Trigger Watchlist</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono">{watchlist?.length || 0}</Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {isLoading ? (
            <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></div>
          ) : watchlist && watchlist.length > 0 ? (
            watchlist.map((item) => (
              <WatchlistItemRow key={item.id} item={item} userId={user.uid} />
            ))
          ) : (
            <div className="py-20 text-center space-y-4 opacity-20">
              <Waves className="w-12 h-12 mx-auto" />
              <p className="text-[9px] uppercase font-black tracking-[0.2em]">Matrix Monitoring Idle</p>
              <p className="text-[8px] font-bold">Set a θ_bet trigger to track drift</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-black/20 text-[8px] text-muted-foreground italic leading-relaxed">
        Engine evaluated evaluated every 15s. Custom TQS and Liquidity floors are processed at the Node cluster level.
      </div>
    </div>
  );
}
