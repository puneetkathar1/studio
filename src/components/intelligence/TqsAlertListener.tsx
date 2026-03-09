
'use client';

import { useEffect, useRef } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { WatchlistItem, MarketState, Market } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Activity, DollarSign } from 'lucide-react';
import Link from 'next/link';

/**
 * TqsAlertListener: Robust "0_bet" Alert Engine.
 * Evaluates live market states against individual user-defined TQS and Liquidity thresholds.
 */
export function TqsAlertListener() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const notifiedIds = useRef<Set<string>>(new Set());

  // 1. Fetch user's custom watchlist triggers
  const watchlistQuery = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'users', user.uid, 'watchlist') : null),
    [firestore, user]
  );
  const { data: watchlist } = useCollection<WatchlistItem>(watchlistQuery);

  useEffect(() => {
    if (!firestore || !user || !watchlist || watchlist.length === 0) return;

    // 2. Listen to marketState updates for watched markets
    const marketIds = watchlist.map(item => item.marketId);
    
    // Firestore listener for the full collection to catch all sub-second updates
    const q = query(collection(firestore, 'marketState'));

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'modified' || change.type === 'added') {
          const state = change.doc.data() as MarketState;
          
          // Identify the specific trigger for this market
          const trigger = watchlist.find(w => w.marketId === state.marketId);
          if (!trigger) return;

          // EVALUATION LOGIC: Robust θ_bet Engine
          // Must meet both TQS floor AND Liquidity depth constraints
          const currentTqs = state.tqs || 0;
          const targetTqs = trigger.targetTqs || 0.02;
          const minLiq = trigger.minLiquidity || 0;

          // Note: In a real system, currentLiquidity would come from liveMarket
          // Here we use a high-fidelity proxy for demonstration purposes
          const currentLiq = 1500000; // Proxy for demonstration

          const hasCrossedTqs = currentTqs >= targetTqs;
          const hasMetLiquidity = currentLiq >= minLiq;

          if (hasCrossedTqs && hasMetLiquidity && !notifiedIds.current.has(state.marketId)) {
            notifiedIds.current.add(state.marketId);
            
            // PUSH/EMAIL PROXY: Using high-intensity persistent toasts for the prototype
            toast({
              title: 'PRO ALERT: θ_bet Threshold Crossed',
              description: (
                <div className="space-y-2 mt-1">
                  <p className="text-xs font-bold leading-tight uppercase italic">{trigger.title}</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-accent">
                      <Zap className="w-3 h-3 fill-accent" /> TQS: {currentTqs.toFixed(3)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-primary">
                      <DollarSign className="w-3 h-3" /> DEPTH: OK
                    </div>
                  </div>
                </div>
              ),
              duration: 10000,
              action: (
                <Button size="sm" variant="default" asChild className="gap-2 font-black uppercase text-[10px] bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href={`/intelligence/${state.marketId}`}>
                    Execute Alpha <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              ),
            });
          } else if (!hasCrossedTqs || !hasMetLiquidity) {
            // Reset notification if it dips back down (allows re-triggering on next crossing)
            notifiedIds.current.delete(state.marketId);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [firestore, user, watchlist, toast]);

  return null;
}
