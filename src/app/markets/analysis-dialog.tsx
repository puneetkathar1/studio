'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Loader2, TrendingUp, Info, Send, Sparkles, Target, BarChart3, Zap, ArrowRight, History } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Market, MarketTick, ExternalSignal } from '@/lib/types';
import { deriveIntelligence, IntelligenceMetrics, calculateStance } from '@/lib/intelligence';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { deriveMarketState } from '@/ai/flows/derive-market-state';
import Link from 'next/link';

export function AnalysisDialog({ market }: { market: Market }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IntelligenceMetrics | null>(null);
  const firestore = useFirestore();

  const handleRunAnalysis = async () => {
    if (!firestore) return;
    setIsAnalyzing(true);
    
    try {
      const ticksQuery = query(
        collection(firestore, 'marketTicks'),
        where('marketId', '==', market.id),
        orderBy('ts', 'desc'),
        limit(20)
      );
      const ticksSnapshot = await getDocs(ticksQuery);
      const ticks = ticksSnapshot.docs.map(d => d.data() as MarketTick);

      const signalsQuery = query(
        collection(firestore, 'externalSignals'),
        orderBy('ts', 'desc'),
        limit(10)
      );
      const signalsSnapshot = await getDocs(signalsQuery);
      const signals = signalsSnapshot.docs.map(d => d.data() as ExternalSignal);

      const currentPrice = ticks.length > 0 ? ticks[0].priceProb : (market.priceProb || 0.5);
      
      // Use unique seed per market for fallback metrics
      const baseMetrics = deriveIntelligence(currentPrice, ticks, (market.id + (market.category || 'General')), signals);
      const intendedStance = calculateStance(baseMetrics.tqs, baseMetrics.convictionFloor);

      const aiState = await deriveMarketState({
        currentPriceProb: currentPrice,
        intendedStance: intendedStance,
        fairMu: baseMetrics.fairMu,
        fairLow: baseMetrics.fairLow,
        fairHigh: baseMetrics.fairHigh,
        evEst: baseMetrics.evEst,
        cmci: baseMetrics.cmci,
        marketFeatures: JSON.stringify({
          sps: baseMetrics.sps,
          cci: baseMetrics.cci,
          tqs: baseMetrics.tqs,
          cmci: baseMetrics.cmci,
          volatility: baseMetrics.tags.includes('Low Stability') ? 'high' : 'normal',
          macroConfirmation: baseMetrics.tags.includes('Macro Confirmation')
        }),
        externalSignals: JSON.stringify(signals.slice(0, 3))
      });

      const finalResult: IntelligenceMetrics = {
        ...baseMetrics,
        classification: intendedStance,
        rationale: aiState.rationale
      };
      
      setAnalysisResult(finalResult);

      const stateRef = doc(firestore, 'marketState', market.id);
      setDocumentNonBlocking(stateRef, {
        marketId: market.id,
        ts: serverTimestamp(),
        currentPriceProb: currentPrice,
        ...finalResult,
        updatedAt: serverTimestamp(),
        version: '1.4' 
      }, { merge: true });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Check Firestore permissions and data.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIssueSignal = async () => {
    if (!user || !analysisResult || !firestore) return;
    
    setIsIssuing(true);
    try {
      const signalId = `sig_${market.id}_${Date.now()}`;
      const ts = serverTimestamp();

      const signalData = {
        marketId: market.id,
        tsIssued: ts,
        marketPriceAtIssue: market.priceProb || 0.5,
        stance: analysisResult.classification,
        direction: analysisResult.evEst > 0 ? 'YES' : 'NO',
        fairLow: analysisResult.fairLow,
        fairHigh: analysisResult.fairHigh,
        evEst: analysisResult.evEst,
        tqs: analysisResult.tqs,
        cmci: analysisResult.cmci,
        tags: analysisResult.tags,
        rationaleShort: analysisResult.rationale,
        version: '1.4',
        issuedByUid: user.uid,
        isPublic: true,
        resolved: false,
        outcome: null,
        realizedPnlUnits: null,
        createdAt: ts,
        updatedAt: ts,
      };

      const ledgerData = {
        marketId: market.id,
        tsIssued: ts,
        marketTitle: market.title,
        venue: market.venue,
        marketPriceAtIssue: signalData.marketPriceAtIssue,
        stance: signalData.stance,
        direction: signalData.direction,
        fairLow: signalData.fairLow,
        fairHigh: signalData.fairHigh,
        evEst: signalData.evEst,
        tqs: signalData.tqs,
        tags: signalData.tags,
        rationaleShort: signalData.rationaleShort,
        resolved: false,
        outcome: null,
        realizedPnlUnits: null,
        version: signalData.version,
        sourceSignalId: signalId,
        createdAt: ts,
        updatedAt: ts,
      };

      const signalRef = doc(firestore, 'signalsIssued', signalId);
      const ledgerRef = doc(firestore, 'publicLedger', signalId);

      setDocumentNonBlocking(signalRef, signalData, {});
      setDocumentNonBlocking(ledgerRef, ledgerData, {});

      toast({
        title: 'Signal Issued',
        description: 'TQS-verified intelligence with macro context committed.',
      });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Issue Failed', description: e.message });
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="h-10 gap-2 font-black uppercase text-[10px] tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 text-foreground">
            <BrainCircuit className="w-4 h-4 text-primary" />
            ANALYZE
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2 text-primary uppercase italic tracking-tighter">
              <BrainCircuit />
              Unified Stance Engine
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{market.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!analysisResult ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest">Awaiting Multi-Factor Context</p>
                  <p className="text-xs text-muted-foreground max-w-[300px] italic">
                    Analyzing price volume + macro economic signals...
                  </p>
                </div>
                <Button onClick={handleRunAnalysis} disabled={isAnalyzing} className="w-full font-black uppercase text-[10px] tracking-[0.2em] h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> FETCHING SIGNALS...</> : 'INITIATE ENGINE'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Trade Quality Score (TQS)</span>
                    <div className="text-2xl font-black font-mono text-accent">{analysisResult.tqs.toFixed(4)}</div>
                  </div>
                  <Badge className="text-sm px-4 py-1 font-black bg-primary text-primary-foreground uppercase">
                    {analysisResult.classification}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-white/5 rounded-md bg-card/50 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded"><Target className="w-4 h-4 text-primary" /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground uppercase font-black">Intel Confidence</span>
                      <span className="font-bold text-primary font-mono text-sm">{analysisResult.intelligenceScore}%</span>
                    </div>
                  </div>
                  <div className="p-3 border border-white/5 rounded-md bg-card/50 flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded"><TrendingUp className="w-4 h-4 text-accent" /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground uppercase font-black">Macro CMCI</span>
                      <span className="font-bold font-mono text-sm text-accent">{analysisResult.cmci.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-md">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-xs text-foreground/90 leading-relaxed italic font-medium">
                      "{analysisResult.rationale}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleIssueSignal} variant="default" className="w-full gap-2 font-black uppercase text-[10px] tracking-widest bg-accent text-accent-foreground shadow-lg shadow-accent/20 h-12" disabled={isIssuing || !user}>
                    {isIssuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                    ACTIVATE SIGNAL
                  </Button>
                  <Button variant="outline" className="w-full h-12 gap-2 font-black uppercase text-[10px] tracking-widest border-white/10" asChild>
                    <Link href={`/intelligence/${market.id}`}>
                      Launch Full Alpha Journey <History className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
