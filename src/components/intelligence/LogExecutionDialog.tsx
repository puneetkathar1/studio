'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Zap, Crosshair, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Market, MarketState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDoc } from '@/firebase/firestore/use-doc';
import { getDeterministicIntelligence } from '@/lib/intelligence';

export function LogExecutionDialog({ market }: { market: Market }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isLogging, setIsLogging] = useState(false);
  const [direction, setDirection] = useState<'YES' | 'NO'>('YES');
  const [entryPrice, setEntryPrice] = useState<string>((market.priceProb || 0.5).toString());
  const [hasAcknowledgedGuardrail, setHasAcknowledgedGuardrail] = useState(false);

  // 1. Fetch User Guardrails
  const rulesQuery = useMemoFirebase(
    () => (firestore && currentUser ? query(collection(firestore, 'users', currentUser.uid, 'guardrail_rules'), where('isActive', '==', true)) : null),
    [firestore, currentUser]
  );
  const { data: rules } = useCollection<any>(rulesQuery);

  // 2. Fetch Market State for Constraint Check
  const stateRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'marketState', market.id) : null),
    [firestore, market.id]
  );
  const { data: marketState } = useDoc<MarketState>(stateRef);

  // 3. Evaluate Guardrails
  const violations = useMemo(() => {
    if (!rules || rules.length === 0) return [];
    
    // FALLBACK: If marketState isn't analyzed, use deterministic proxy
    const context = marketState || getDeterministicIntelligence(market.id, market.priceProb || 0.5);
    
    const activeViolations: any[] = [];
    rules.forEach((rule: any) => {
      let isViolated = false;
      const tqs = (context as any).tqs || 0;
      const cci = (context as any).intelligenceScore ? (context as any).intelligenceScore / 100 : 0.5;
      const ev = (context as any).evEst || (context as any).ev || 0;
      const tvs = (context as any).tvs || 'Optimal';
      const whaleRisk = (context as any).whaleRisk || 'low';

      if (rule.conditionExpression === "evEst < 0.03" && ev < 0.03) isViolated = true;
      if (rule.conditionExpression === "cci < 0.60" && cci < 0.60) isViolated = true;
      if (rule.conditionExpression === "tvs == 'Late'" && tvs === 'Late') isViolated = true;
      if (rule.conditionExpression === "whaleRisk != 'low'" && whaleRisk !== 'low') isViolated = true;
      
      if (isViolated) activeViolations.push(rule);
    });
    return activeViolations;
  }, [rules, marketState, market.id, market.priceProb]);

  const handleLogEntry = async () => {
    if (!currentUser || !firestore) return;
    
    setIsLogging(true);
    try {
      const tradeId = `trade_${market.id}_${Date.now()}`;
      const ref = doc(firestore, 'users', currentUser.uid, 'trades', tradeId);
      
      const price = parseFloat(entryPrice);
      if (isNaN(price) || price <= 0 || price >= 1) {
        throw new Error("Invalid price basis.");
      }

      // If there were violations and user clicked commit, log the violation to registry
      if (violations.length > 0) {
        violations.forEach(v => {
          const vId = `violation_${Date.now()}_${v.id}`;
          const vRef = doc(firestore, 'users', currentUser.uid, 'guardrail_violations', vId);
          setDocumentNonBlocking(vRef, {
            id: vId,
            userId: currentUser.uid,
            guardrailRuleId: v.id,
            violationTimestamp: serverTimestamp(),
            triggeredConditionDetails: v.conditionExpression,
            proposedUserAction: `Log ${direction} entry at $${price}`,
            systemResponse: 'OVERRIDDEN',
            userOverrideDecision: true,
            contextDataSnapshot: JSON.stringify(marketState || {})
          }, { merge: true });
        });
      }

      await setDocumentNonBlocking(ref, {
        id: tradeId,
        marketId: market.id,
        marketTitle: market.title,
        venue: market.venue,
        entryPrice: price,
        direction,
        units: 1.0, 
        tsLogged: serverTimestamp(),
        resolved: market.status === 'resolved',
        outcome: market.resolvedOutcome ?? null,
        realizedPnlUnits: null,
        createdAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: violations.length > 0 ? 'Entry Logged (Override)' : 'Execution Logged',
        description: `Successfully recorded ${direction} entry at $${price.toFixed(3)}.`,
      });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Logging Failed', description: e.message });
    } finally {
      setIsLogging(false);
    }
  };

  const isInhibited = violations.length > 0 && !hasAcknowledgedGuardrail;

  return (
    <DialogContent className="sm:max-w-[425px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded border border-accent/20">
            <Crosshair className="w-5 h-5 text-accent" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black font-headline tracking-tighter uppercase italic">
              Log Personal Entry
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio Audit Protocol v1.4
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* GUARDRAIL ALERT SYSTEM */}
        {violations.length > 0 && (
          <div className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-5 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Guardrail Violation Node</h4>
            </div>
            <div className="space-y-2">
              {violations.map(v => (
                <div key={v.id} className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-foreground/80">{v.name}</span>
                  <Badge variant="destructive" className="text-[8px] h-4 font-black">SOFT_BLOCK</Badge>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch checked={hasAcknowledgedGuardrail} onCheckedChange={setHasAcknowledgedGuardrail} className="data-[state=checked]:bg-destructive" />
              <Label className="text-[9px] font-black uppercase text-destructive/80 italic leading-relaxed">
                I acknowledge the process violation and wish to override the constraint.
              </Label>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry Direction</Label>
          <RadioGroup 
            value={direction} 
            onValueChange={(v: any) => setDirection(v)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="YES" id="yes" className="sr-only" />
              <Label
                htmlFor="yes"
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                  direction === 'YES' && "border-primary bg-primary/5"
                )}
              >
                <span className="text-xl font-black italic">YES</span>
                <span className="text-[8px] font-bold uppercase mt-1">Bullish Stance</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="NO" id="no" className="sr-only" />
              <Label
                htmlFor="no"
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                  direction === 'NO' && "border-destructive bg-destructive/5"
                )}
              >
                <span className="text-xl font-black italic">NO</span>
                <span className="text-[8px] font-bold uppercase mt-1">Bearish Stance</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry Price Basis</Label>
            <Badge variant="outline" className="text-[10px] font-mono font-bold border-white/10">Venue Midpoint: ${(market.priceProb || 0.5).toFixed(3)}</Badge>
          </div>
          <Input 
            type="number" 
            step="0.001" 
            value={entryPrice} 
            onChange={(e) => setEntryPrice(e.target.value)}
            className="h-12 bg-background/50 font-mono text-lg font-black border-white/10" 
          />
        </div>

        <Button 
          className={cn(
            "w-full h-14 font-black uppercase tracking-widest text-xs shadow-lg gap-2 transition-all",
            isInhibited ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : violations.length > 0 ? "bg-destructive text-white shadow-destructive/20" : "bg-accent text-accent-foreground shadow-accent/20 hover:bg-accent/90"
          )}
          onClick={handleLogEntry}
          disabled={isLogging || !currentUser || isInhibited}
        >
          {isLogging ? <Loader2 className="w-4 h-4 animate-spin" /> : violations.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
          {violations.length > 0 ? 'Override & Commit Entry' : 'Commit Entry to Audit'}
        </Button>
      </div>
    </DialogContent>
  );
}
