'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate and update a high-precision countdown timer.
 * Fixed: Uses primitive timestamp dependency and functional updates with equality guard to prevent recursion.
 */
export function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Stability: Use the primitive timestamp as a dependency instead of the Date object reference
  const targetTimestamp = targetDate?.getTime() ?? null;

  useEffect(() => {
    if (!targetTimestamp || isNaN(targetTimestamp)) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        return 'RESOLVED';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const d = days.toString().padStart(2, '0');
      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');

      return `${d}d ${h}h ${m}m ${s}s`;
    };

    // Initial calculation
    const initialValue = calculateTime();
    setTimeLeft(initialValue);

    const interval = setInterval(() => {
      const updatedValue = calculateTime();
      // Stability Check: Only update if the string value has actually changed to break recursion
      setTimeLeft(prev => prev !== updatedValue ? updatedValue : prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return timeLeft;
}
