'use client';

import { useEffect, useRef } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc, serverTimestamp } from 'firebase/firestore';
import { Market } from '@/lib/types';

/**
 * WhaleTrackerSimulator: Optimized background service for prototype feel.
 * QUOTA PROTECTION: Interval increased to 10 minutes with 90% skip probability.
 */
export function WhaleTrackerSimulator() {
  const firestore = useFirestore();
  const { user } = useUser();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), limit(10)) : null,
    [firestore]
  );
  const { data: markets } = useCollection<Market>(marketsQuery);

  useEffect(() => {
    if (!firestore || !user || !markets || markets.length === 0) return;

    const performWhaleSync = async () => {
      // QUOTA PROTECTION: 90% probability of skipping a write.
      if (Math.random() > 0.1) return;

      const archetypes = [
        { id: 'whale_0x82', identity: '0x82...42F1', type: 'wallet', label: 'News Sniper', hitRate: 94.2, roi: 142.8, volume: 1420000, tags: ['Sniper', 'Informational'], timingSkill: 96.4 },
        { id: 'whale_poly_top', identity: 'HighVol_Alpha', type: 'public_trader', label: 'Market Absorber', hitRate: 88.4, roi: 62.4, volume: 890000, tags: ['Absorber', 'Passive Depth'], timingSkill: 74.2 }
      ];

      const w = archetypes[Math.floor(Math.random() * archetypes.length)];
      const target = markets[Math.floor(Math.random() * markets.length)];
      
      const whaleRef = doc(firestore, 'whales', w.id);
      setDocumentNonBlocking(whaleRef, {
        id: w.id,
        identity: w.identity,
        label: w.label,
        hitRate: w.hitRate + (Math.random() - 0.5),
        roi: w.roi + (Math.random() * 1.5),
        totalVolume: w.volume + (Math.random() * 25000),
        lastActiveAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      const stateRef = doc(firestore, 'marketState', target.id);
      const tqs = 0.015 + (Math.random() * 0.01);
      
      setDocumentNonBlocking(stateRef, {
        marketId: target.id,
        tqs,
        whaleRisk: Math.random() > 0.8 ? 'high' : 'low',
        updatedAt: serverTimestamp()
      }, { merge: true });
    };

    // QUOTA OPTIMIZATION: 10-minute interval (600,000ms)
    intervalRef.current = setInterval(performWhaleSync, 600000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [firestore, user, markets]);

  return null;
}
