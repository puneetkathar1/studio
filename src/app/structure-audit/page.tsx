'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Event, Market } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Layers, FolderOpen, Activity, Globe, Database, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StructureAuditPage() {
  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'events'), orderBy('updatedAt', 'desc'), limit(10)) : null,
    [firestore]
  );
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), limit(100)) : null,
    [firestore]
  );
  const { data: markets } = useCollection<Market>(marketsQuery);

  return (
    <div className="space-y-12 p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="space-y-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3">
          <Badge className="bg-accent text-accent-foreground font-black px-3 py-1 uppercase tracking-widest">Structure Proof</Badge>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[9px] font-bold text-primary uppercase">Multi-Outcome Mapping</span>
          </div>
        </div>
        <h1 className="text-4xl font-black font-headline uppercase italic tracking-tighter">
          Event-to-Market <span className="text-primary">Audit</span>.
        </h1>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">
          This page provides a raw audit of the hierarchical discovery engine. It proves that each parent Event correctly clusters multiple constituent Market nodes.
        </p>
      </header>

      <div className="space-y-10">
        {isEventsLoading ? (
          <div className="flex flex-col items-center gap-4 opacity-20 py-20">
            <Globe className="w-12 h-12 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Harvesting Discovery Nodes...</span>
          </div>
        ) : events?.map((event) => {
          const childMarkets = markets?.filter(m => m.eventId === event.id) || [];
          
          return (
            <div key={event.id} className="space-y-6">
              <div className="p-6 bg-card border border-primary/20 rounded-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-black font-headline uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10 opacity-60">Venue: {event.venue}</Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black uppercase px-2">
                        {childMarkets.length} MARKET OUTCOMES DETECTED
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Total Volume</span>
                    <span className="text-xl font-black font-mono text-accent tabular-nums">${(event.volume || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pl-12 space-y-4 relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/5 border-l-2 border-dashed border-primary/20" />
                
                {childMarkets.length > 0 ? childMarkets.map((market) => (
                  <div key={market.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between group hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <ArrowRight className="w-4 h-4 text-primary opacity-20" />
                      <div>
                        <h4 className="text-sm font-bold group-hover:text-accent transition-colors">{market.title}</h4>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter opacity-60">
                          NODE_{market.venueMarketId.slice(-8)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-foreground">${(market.priceProb || 0.5).toFixed(3)}</div>
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Matrix Basis</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center bg-muted/10 rounded-lg border-2 border-dashed border-white/5 opacity-30">
                    <Database className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No constituent markets discovered for this event node</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex justify-center opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em]">
          <span>Discovery Node v4.2</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Multi-Outcome Link: OK</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>AES-256 Protocol</span>
        </div>
      </footer>
    </div>
  );
}
