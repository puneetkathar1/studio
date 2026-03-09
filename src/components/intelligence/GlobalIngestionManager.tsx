'use client';

/**
 * GlobalIngestionManager: DEPRECATED (Moved to Server-Side Cloud Functions).
 * Background harvesting is now handled autonomously by Firebase Scheduler
 * to ensure 24/7 reliability and session persistence.
 */
export function GlobalIngestionManager() {
  // Client-side interval logic removed to prioritize Cloud Functions.
  return null;
}
