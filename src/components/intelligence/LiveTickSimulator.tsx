'use client';

import { useEffect, useRef } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Market } from '@/lib/types';

/**
 * LiveTickSimulator: Optimized background service for prototype feel.
 * QUOTA PROTECTION: Interval increased to 10 minutes with 90% skip probability.
 */
export function LiveTickSimulator() {
  const firestore = useFirestore();
  const { user } = useUser();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const marketsQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'markets'),
      where('status', '==', 'open'),
      orderBy('volume', 'desc'),
      limit(10)
    ) : null,
    [firestore]
  );
  const { data: markets } = useCollection<Market>(marketsQuery);

  useEffect(() => {
    if (!firestore || !user || !markets || markets.length === 0) return;

    const performLiveTick = async () => {
      // QUOTA PROTECTION: 90% probability of skipping a write.
      // This ensures only 1 in 10 active clients actually performs a write.
      if (Math.random() > 0.1) return;

      const batch = writeBatch(firestore);
      
      const target = markets[Math.floor(Math.random() * markets.length)];
      if (!target) return;

      const currentPrice = target.priceProb || 0.5;
      const currentVol = target.volume || 100000;

      const delta = (Math.random() - 0.5) * 0.01;
      const newPrice = Math.max(0.01, Math.min(0.99, currentPrice + delta));
      
      const marketRef = doc(firestore, 'markets', target.id);
      batch.update(marketRef, {
        priceProb: newPrice,
        volume: currentVol + (Math.random() * 2000),
        updatedAt: serverTimestamp()
      });

      const tickId = `tick_${target.id}_${Date.now()}`;
      const tickRef = doc(firestore, 'marketTicks', tickId);
      batch.set(tickRef, {
        marketId: target.id,
        ts: serverTimestamp(),
        priceProb: newPrice,
        volume: (currentVol / 10000) + Math.random(),
        createdAt: serverTimestamp()
      });

      try {
        await batch.commit();
      } catch (e) {
        // Silent catch for quota protection
      }
    };

    // QUOTA OPTIMIZATION: 10-minute interval (600,000ms)
    intervalRef.current = setInterval(performLiveTick, 600000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [firestore, user, markets]);

  return null;
}
