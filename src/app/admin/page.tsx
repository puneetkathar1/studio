'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Radio, 
  RefreshCcw, 
  TrendingUp, 
  Activity, 
  Terminal, 
  Database, 
  DatabaseZap, 
  Globe, 
  Lock, 
  ShieldAlert, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  Layers,
  Search,
  ArrowRightLeft,
  Key
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFirestore, useCollection, useMemoFirebase, useUser, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase'
import { collection, query, orderBy, limit, doc, serverTimestamp, writeBatch, Timestamp, where, getDocs } from 'firebase/firestore'
import { fetchKalshiEventMetadataMap, triggerManualIngestion } from './actions'
import { ExternalSignal } from '@/lib/types'
import { format } from 'date-fns'

export default function AdminPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isElevating, setIsElevating] = useState(false)
  const [isAdminElevating, setIsAdminElevating] = useState(false)
  const [isInstElevating, setIsInstElevating] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()

  const signalsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'externalSignals'), orderBy('ts', 'desc'), limit(10)) : null,
    [firestore]
  );
  const { data: signals, isLoading: isSignalsLoading } = useCollection<ExternalSignal>(signalsQuery);

  const handleTriggerLiveIngestion = async () => {
    if (!firestore) return;
    setIsSyncing(true)
    setSyncFeedback("Triggering backend ingestion...")

    try {
      // STEP 0: Trigger real backend ingestion via server action (avoids browser CORS).
      const ingestionResult = await triggerManualIngestion();
      if (!ingestionResult.success) {
        throw new Error(`manualTriggerIngestion failed: ${ingestionResult.message}`);
      }
      console.log('[KALSHI FIX] ✅ manualTriggerIngestion response:', {
        endpoint: ingestionResult.endpoint,
        message: ingestionResult.message,
      });

      setSyncFeedback("Cleaning old events...")

      // STEP 1: Delete all old Kalshi events
      console.log('[KALSHI FIX] Deleting all old Kalshi events...');
      const eventsRef = collection(firestore, 'events');
      const oldEventsQuery = query(eventsRef, where('venue', '==', 'kalshi'));
      const oldEventsSnapshot = await getDocs(oldEventsQuery);
      
      console.log(`[KALSHI FIX] Found ${oldEventsSnapshot.size} old Kalshi events to delete`);
      
      let batch = writeBatch(firestore);
      let opCount = 0;
      
      for (const docSnap of oldEventsSnapshot.docs) {
        batch.delete(docSnap.ref);
        opCount++;
        
        if (opCount >= 50) {
          await batch.commit();
          batch = writeBatch(firestore);
          opCount = 0;
        }
      }
      
      if (opCount > 0) {
        await batch.commit();
      }
      
      console.log('[KALSHI FIX] ✅ Deleted all old Kalshi events');
      
      // STEP 2: Check what eventIds markets have
      setSyncFeedback("Creating fresh events...")
      console.log('[KALSHI FIX] Checking what eventIds markets actually have...');
      
      const marketsRef = collection(firestore, 'markets');
      const kalshiQuery = query(marketsRef, where('venue', '==', 'kalshi'));
      const snapshot = await getDocs(kalshiQuery);
      
      console.log(`[KALSHI FIX] Found ${snapshot.size} Kalshi markets`);
      
      const eventIdsFromMarkets = new Map<string, number>();
      
      snapshot.docs.forEach(docSnap => {
        const market = docSnap.data();
        const eventId = market.eventId;
        
        if (eventId && eventId.startsWith('kalshi_ev_')) {
          eventIdsFromMarkets.set(eventId, (eventIdsFromMarkets.get(eventId) || 0) + 1);
        }
      });
      
      console.log(`[KALSHI FIX] Found ${eventIdsFromMarkets.size} unique eventIds in markets`);
      const targetTickers = Array.from(eventIdsFromMarkets.keys()).map((id) => id.replace('kalshi_ev_', ''));
      
      // STEP 3: Fetch canonical event metadata from Kalshi API
      setSyncFeedback("Generating proper event titles...")
      console.log('[KALSHI FIX] Fetching canonical Kalshi event metadata...');
      const kalshiMeta = await fetchKalshiEventMetadataMap(targetTickers);
      const tickerToMeta = kalshiMeta.map;
      console.log(`[KALSHI FIX] ✅ Loaded ${kalshiMeta.count} Kalshi event metadata rows`);
      
      // STEP 4: Create fresh events with proper titles
      batch = writeBatch(firestore);
      opCount = 0;
      
      for (const [eventId, marketCount] of eventIdsFromMarkets.entries()) {
        const ticker = eventId.replace('kalshi_ev_', '');
        const meta = tickerToMeta[ticker];
        const properTitle = meta?.title || ticker
          .replace(/^KX/, '')
          .replace(/([A-Z])/g, ' $1')
          .trim() || ticker;
        
        console.log(`[KALSHI FIX] Setting ${eventId} with title: "${properTitle}"`);
        
        batch.set(doc(firestore, 'events', eventId), {
          id: eventId,
          title: properTitle,
          venue: 'kalshi',
          venueEventId: ticker,
          status: meta?.status || 'open',
          category: meta?.category || 'General',
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        
        opCount++;
        console.log(`[KALSHI FIX] Created event: ${eventId} - "${properTitle}" (${marketCount} markets)`);
        
        if (opCount >= 50) {
          await batch.commit();
          console.log(`[KALSHI FIX] Committed batch of ${opCount} events`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          batch = writeBatch(firestore);
          opCount = 0;
        }
      }
      
      if (opCount > 0) {
        await batch.commit();
        console.log(`[KALSHI FIX] Committed final batch of ${opCount} events`);
      }
      
      console.log(`[KALSHI FIX] ✅ Created ${eventIdsFromMarkets.size} fresh events with proper titles`);
      console.log(`[KALSHI FIX] ℹ️ Check Markets → Events view and HARD REFRESH (Cmd+Shift+R) to see new titles`);
      
      setSyncFeedback("✅ Fix Complete! HARD REFRESH (Cmd+Shift+R) the Markets page to see event titles.")
      toast({ 
        title: 'Kalshi Events Fixed', 
        description: `Created ${eventIdsFromMarkets.size} fresh events with proper titles.\n\nHARD REFRESH Markets page (Cmd+Shift+R) to load updated data.`,
        duration: 7000 
      });
      setTimeout(() => setSyncFeedback(null), 5000)
    } catch (err: any) {
      console.error('[KALSHI FIX] Error:', err);
      setSyncFeedback(`❌ Ingestion failed: ${err?.message || 'Unknown error'}`);
      toast({ variant: 'destructive', title: 'Fix Failed', description: err.message });
      setTimeout(() => setSyncFeedback(null), 6000)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleInitializeSchema = async () => {
    if (!firestore) return;
    setIsInitializing(true)
    try {
      const batch = writeBatch(firestore);
      const ts = serverTimestamp();
      const eventId = 'force_ev_spacex_starship';
      batch.set(doc(firestore, 'events', eventId), {
        id: eventId, ticker: 'SPACEX-STARSHIP-IFT-4', title: 'SpaceX Starship Flight Test (IFT-4)',
        venue: 'polymarket', status: 'open', category: 'Tech', updatedAt: ts, createdAt: ts,
      }, { merge: true });
      const marketId = 'polymarket_starship_ift4_success';
      batch.set(doc(firestore, 'markets', marketId), {
        id: marketId, eventId, venue: 'polymarket', venueMarketId: 'will-starship-ift-4-achieve-successful-splashdown',
        title: 'Will Starship IFT-4 achieve successful splashdown?', category: 'Tech', outcomeType: 'binary',
        status: 'open', priceProb: 0.64, updatedAt: ts, createdAt: ts,
      }, { merge: true });
      await batch.commit();
      toast({ title: 'Schema Forced Successfully', description: 'Collection "events" is now active.' })
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Initialization Failed', description: err.message })
    } finally {
      setIsInitializing(false)
    }
  }

  const handleForceProStatus = () => {
    if (!firestore || !user) return;
    setIsElevating(true);
    const userRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userRef, { plan: 'pro', updatedAt: serverTimestamp() });
    setTimeout(() => { setIsElevating(false); toast({ title: 'Access Elevated', description: 'User node upgraded to PRO.' }); }, 1000);
  }

  const handleForceAdminStatus = () => {
    if (!firestore || !user) return;
    setIsAdminElevating(true);
    const adminRef = doc(firestore, 'roles_admin', user.uid);
    setDocumentNonBlocking(adminRef, { userId: user.uid, grantedAt: serverTimestamp() }, { merge: true });
    setTimeout(() => { setIsAdminElevating(false); toast({ title: 'Authority Established', description: 'Admin Node active.' }); }, 1000);
  }

  const handleForceInstitutionalStatus = () => {
    if (!firestore || !user) return;
    setIsInstElevating(true);
    const userRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userRef, { plan: 'internal', updatedAt: serverTimestamp() });
    setTimeout(() => { setIsInstElevating(false); toast({ title: 'Access Absolute', description: 'Institutional Node active.' }); }, 1000);
  }

  const handleResetOnboarding = () => {
    localStorage.removeItem('pip_onboarding_complete');
    localStorage.removeItem('pip_pro_onboarding_complete');
    toast({ title: 'Protocols Reset', description: 'Tours will re-trigger on next refresh.' });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-left selection:bg-primary/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit border-accent text-accent-foreground font-black px-3 py-1 uppercase tracking-widest bg-accent/5">
            System Mode: HIERARCHICAL_SYNC
          </Badge>
          <h1 className="text-5xl font-black font-headline tracking-tighter uppercase italic leading-none">
            Command <span className="text-primary">Console</span>.
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Orchestrate high-performance data harvesting across the global prediction substrate.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-accent/40 shadow-lg bg-accent/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><DatabaseZap className="w-12 h-12" /></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent text-sm uppercase tracking-widest font-black">
              <Database className="w-4 h-4" /> Force Schema
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60 text-left">Initialize Base Clusters.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter text-left">Writes directly from client to establish initial node pointers.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" onClick={handleInitializeSchema} disabled={isInitializing} className="w-full gap-2 font-black uppercase text-[10px] tracking-widest h-10 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
              {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Force Database Initialize
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary/20 shadow-lg bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><Globe className="w-12 h-12" /></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-black">
              <RefreshCcw className="w-4 h-4" /> Hierarchical Ingestion
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60 text-left">1000-Node Sweep Protocol.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter text-left">Uses multi-factor title resolution to purge outcome lists.</p>
            {syncFeedback && (
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded border border-white/5 animate-in fade-in zoom-in-95">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span className="text-[9px] font-black text-primary uppercase">{syncFeedback}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button size="sm" onClick={handleTriggerLiveIngestion} disabled={isSyncing} className="w-full gap-2 font-black uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Trigger Live Ingestion
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-accent/40 shadow-lg bg-accent/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><ShieldAlert className="w-12 h-12" /></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent text-sm uppercase tracking-widest font-black">
              <Lock className="w-4 h-4" /> Access Node Elevation
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60 text-left">Subscriber Key Injection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" onClick={handleForceProStatus} disabled={isElevating} className="w-full gap-2 font-black uppercase text-[10px] tracking-widest h-9 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
              {isElevating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Elevate to PRO
            </Button>
            <Button size="sm" onClick={handleForceInstitutionalStatus} disabled={isInstElevating} className="w-full gap-2 font-black uppercase text-[10px] tracking-widest h-9 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
              {isInstElevating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
              Elevate to INST
            </Button>
            <Button size="sm" onClick={handleForceAdminStatus} disabled={isAdminElevating} className="w-full gap-2 font-black uppercase text-[10px] tracking-widest h-9 shadow-lg bg-white text-primary hover:bg-white/90">
              {isAdminElevating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              Grant Admin Protocol
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-muted/10 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest font-black text-muted-foreground">
              <Terminal className="w-4 h-4" /> Onboarding Cache
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase opacity-60 text-left">Reset Walkthrough Protocols.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter text-left">Clears local tour flags for re-briefing.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={handleResetOnboarding} className="w-full gap-2 font-black uppercase text-[10px] h-10 border-white/10 hover:bg-white/5">
              <Trash2 className="w-4 h-4" /> Reset All Onboarding
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-left">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black uppercase tracking-tighter italic">Signal Context Registry</h2>
          </div>
          <Badge variant="secondary" className="text-[9px] font-black uppercase">Active Registry</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isSignalsLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)
          ) : signals && signals.length > 0 ? (
            signals.map((s) => (
              <div key={s.id} className="p-4 bg-card border border-white/10 rounded-xl space-y-2 group hover:border-primary/30 transition-all text-left">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary">{s.signalType}</Badge>
                  <span className="text-[8px] text-muted-foreground font-mono">
                    {s.ts?.toDate ? format(s.ts.toDate(), 'HH:mm:ss') : 'N/A'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold leading-tight truncate">{s.signalName}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black font-mono tracking-tighter">{s.value}</span>
                    {s.delta !== null && (
                      <span className={`text-[10px] font-bold ${s.delta >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {s.delta >= 0 ? '+' : ''}{s.delta}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest opacity-60 truncate">Basis: {s.source}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-muted/10 border-2 border-dashed border-white/5 rounded-xl">
              <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry empty. Run Macro Sync node.</p>
            </div>
          )}
        </div>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-black uppercase text-[10px] tracking-widest">Protocol Integrity</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
          Titles are resolved using hierarchical phonetic and structural hashing. Data is fetched via Server Action and written via Client SDK. Admin status is required for signal commitment.
        </AlertDescription>
      </Alert>
    </div>
  )
}
