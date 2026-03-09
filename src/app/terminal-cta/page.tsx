
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import { TerminalBody } from '@/components/terminal/terminal-body';
import { TerminalFooter } from '@/components/terminal/terminal-footer';
import { PublicLedgerEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function TerminalCTAPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  // State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'LIVE' | 'OFFLINE'>('LIVE');
  const [latency, setLatency] = useState<number>(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [stanceFilters, setStanceFilters] = useState<string[]>(['BET', 'WAIT', 'NO_BET']);

  // Data Fetching
  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(50)) : null,
    [firestore]
  );

  const { data: rawEntries, isLoading, error } = useCollection<PublicLedgerEntry>(ledgerQuery);

  // Latency & Connection Monitoring
  useEffect(() => {
    if (rawEntries) {
      const now = Date.now();
      setLatency(now - lastFetchTime);
      setLastFetchTime(now);
      setConnectionStatus('LIVE');
    }
    if (error) {
      setConnectionStatus('OFFLINE');
    }
  }, [rawEntries, error]);

  // Filtering
  const filteredEntries = useMemo(() => {
    if (!rawEntries) return [];
    return rawEntries.filter(e => {
      const matchesSearch = e.marketTitle?.toLowerCase().includes(search.toLowerCase());
      const matchesVenue = venueFilter === 'all' || e.venue === venueFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'resolved' ? e.resolved : !e.resolved);
      const matchesStance = stanceFilters.includes(e.stance);
      return matchesSearch && matchesVenue && matchesStatus && matchesStance;
    });
  }, [rawEntries, search, venueFilter, statusFilter, stanceFilters]);

  const selectedEntry = useMemo(() => 
    filteredEntries.find(e => e.id === selectedId) || filteredEntries[0], 
    [filteredEntries, selectedId]
  );

  // Keyboard Hotkeys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = filteredEntries.findIndex(ent => ent.id === (selectedId || filteredEntries[0]?.id));
      const next = filteredEntries[currentIndex + 1];
      if (next) setSelectedId(next.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = filteredEntries.findIndex(ent => ent.id === (selectedId || filteredEntries[0]?.id));
      const prev = filteredEntries[currentIndex - 1];
      if (prev) setSelectedId(prev.id);
    } else if (e.key === 'f') {
      e.preventDefault();
      document.getElementById('terminal-search')?.focus();
    } else if (e.key === 'r') {
      e.preventDefault();
      window.location.reload();
    } else if (e.key === 'Escape') {
      setSelectedId(null);
    }
  }, [filteredEntries, selectedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-[#0B0E14] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none">
      {/* 1. Top Ticker Tape */}
      <TickerTape entries={rawEntries || []} />

      {/* 2. Header Bar */}
      <TerminalHeader status={connectionStatus} latency={latency} />

      {/* 3. Main Body */}
      <TerminalBody 
        entries={filteredEntries}
        selectedEntry={selectedEntry}
        isLoading={isLoading}
        onSelect={setSelectedId}
        filters={{
          search, setSearch,
          venueFilter, setVenueFilter,
          statusFilter, setStatusFilter,
          stanceFilters, setStanceFilters
        }}
      />

      {/* 4. Bottom Bar CTA */}
      <TerminalFooter />
    </div>
  );
}
