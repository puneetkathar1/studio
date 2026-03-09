
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { BellRing, Target, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Market } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AlertConfigDialogProps {
  market: Market;
  isWatched: boolean;
  onClose?: () => void;
}

export function AlertConfigDialog({ market, isWatched, onClose }: AlertConfigDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [targetTqs, setTargetTqs] = useState(0.02);
  const [minLiquidity, setMinLiquidity] = useState(1000000); // Default $1M

  const handleSetAlert = async () => {
    if (!user || !firestore) return;

    const ref = doc(firestore, 'users', user.uid, 'watchlist', market.id);
    
    setDocumentNonBlocking(ref, {
      marketId: market.id,
      title: market.title,
      venue: market.venue,
      targetTqs,
      minLiquidity,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    toast({
      title: 'Alert Protocol Active',
      description: `Monitoring ${market.title.slice(0, 30)}... for TQS > ${targetTqs} and Liquidity > $${(minLiquidity/1000000).toFixed(1)}M.`,
    });

    if (onClose) onClose();
  };

  const handleRemoveAlert = () => {
    if (!user || !firestore) return;
    const ref = doc(firestore, 'users', user.uid, 'watchlist', market.id);
    deleteDocumentNonBlocking(ref);
    toast({
      title: 'Alert Protocol Terminated',
      description: 'Node monitoring has been disabled.',
    });
    if (onClose) onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded border border-primary/20">
            <BellRing className="w-5 h-5 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black font-headline tracking-tighter uppercase italic">
              θ_bet Alert Engine
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Pro Ingestion Monitoring v4.2
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-8 py-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary" /> TQS Trigger Floor
            </Label>
            <Badge variant="outline" className="text-xs font-black font-mono text-primary border-primary/30">
              {targetTqs.toFixed(3)}
            </Badge>
          </div>
          <Slider 
            value={[targetTqs * 1000]} 
            onValueChange={([v]) => setTargetTqs(v / 1000)}
            max={50} 
            step={1}
            className="py-2"
          />
          <p className="text-[9px] text-muted-foreground italic leading-relaxed">
            The minimum Trade Quality Score required to trigger a high-conviction broadcast. (Institutional Standard: 0.020)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-accent" /> Min Liquidity Floor
            </Label>
            <Badge variant="outline" className="text-xs font-black font-mono text-accent border-accent/30">
              ${(minLiquidity / 1000000).toFixed(1)}M
            </Badge>
          </div>
          <Slider 
            value={[minLiquidity]} 
            onValueChange={([v]) => setMinLiquidity(v)}
            max={5000000} 
            step={100000}
            className="py-2"
          />
          <p className="text-[9px] text-muted-foreground italic leading-relaxed">
            Ensures alpha is executable. Inhibits alerts during periods of thin depth or venue protocol instability.
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Verification</h4>
          </div>
          <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
            Alerts are verified against multi-venue consensus. Push and Email broadasts are routed through the secure Subscriber Key gateway.
          </p>
        </div>

        <div className="flex gap-3">
          {isWatched && (
            <Button variant="ghost" className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-destructive/10 hover:text-destructive" onClick={handleRemoveAlert}>
              Remove Alert
            </Button>
          )}
          <Button className="flex-[2] h-11 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2" onClick={handleSetAlert}>
            <Zap className="w-4 h-4 fill-current" />
            {isWatched ? 'Update Protocol' : 'Initialize Monitoring'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
