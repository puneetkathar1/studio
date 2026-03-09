'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ShieldAlert, 
  Anchor, 
  Globe, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft,
  Target,
  Cpu,
  Lock,
  Radar,
  Scale,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

const PRO_STEPS = [
  {
    title: "Pro Institutional Access",
    description: "Your terminal has been upgraded to the high-conviction execution layer. Welcome to the Pro Protocol.",
    icon: Lock,
    color: "text-accent",
    content: (
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          You now have access to the full suite of institutional tools designed to isolate alpha and inhibit mechanical risk.
        </p>
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg italic text-[10px] text-accent">
          "The professional trader manages risk; the amateur manages hope."
        </div>
      </div>
    )
  },
  {
    title: "Alpha Stream",
    description: "Real-time high-conviction broadcast node.",
    icon: Zap,
    color: "text-accent",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">The <strong>Alpha Stream</strong> broadcasts only the nodes that have crossed the θ_bet threshold (0.020). Every signal is pre-filtered for whale toxicity.</p>
        <div className="flex items-center gap-2">
          <Badge className="bg-accent text-accent-foreground text-[8px] font-black uppercase">θ_bet Triggered</Badge>
          <span className="text-[10px] font-mono text-accent">Conviction: 94.2%</span>
        </div>
      </div>
    )
  },
  {
    title: "Trade Guardrails",
    description: "Automated behavioral self-control engine.",
    icon: ShieldAlert,
    color: "text-destructive",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Establish <strong>Guardrails</strong> to soft-block impulsive entries. Define hard logic constraints like &quot;Min EVS &gt; 3%&quot; to enforce your trading framework.</p>
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-[9px] font-black text-destructive uppercase">
          Inhibitor: Active Enforcement Mode
        </div>
      </div>
    )
  },
  {
    title: "Whale Matrix",
    description: "Separate news from noise.",
    icon: Anchor,
    color: "text-primary",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Identify <strong>Whale Fingerprints</strong>. Separates Informational discovery from Mechanical pinning. Avoid 🔴 Toxic nodes where price discovery is artificial.</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-black uppercase text-destructive">Whale-Dominated Mode Detected</span>
        </div>
      </div>
    )
  },
  {
    title: "Macro Correlation Lab",
    description: "Global sensitivity weighting.",
    icon: Globe,
    color: "text-primary",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">The <strong>Macro Lab</strong> visualizes how global signals (CPI, Fed Rates) pull market narratives. TQS scalars are dynamically re-weighted based on these hidden strings.</p>
        <div className="flex items-center gap-2 text-[10px] font-black text-primary">
          <Scale className="w-3.5 h-3.5" /> Multiplier: 1.12x applied
        </div>
      </div>
    )
  },
  {
    title: "Pro Champion (Arb)",
    description: "Deterministic venue decoupling.",
    icon: TrendingUp,
    color: "text-accent",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Identify price discrepancies between venues. Use <strong>Atomic Pathing</strong> to buy on one protocol and sell on another to lock in Δ-Basis spreads.</p>
        <div className="bg-accent/10 p-2 rounded border border-accent/20 text-center font-mono text-[10px] font-black text-accent">
          Δ-BASIS: 0.042c (ARBITRAGE READY)
        </div>
      </div>
    )
  }
];

export function ProOnboardingTour() {
  const { data: profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  useEffect(() => {
    if (!isPro) return;
    
    const isComplete = typeof window !== 'undefined' ? localStorage.getItem('pip_pro_onboarding_complete') : 'true';
    if (!isComplete) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPro]);

  const handleNext = () => {
    if (currentStep < PRO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pip_pro_onboarding_complete', 'true');
    setOpen(false);
  };

  if (!isPro) return null;

  const step = PRO_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] bg-[#05070A] border-accent/30 text-foreground shadow-[0_0_50px_rgba(0,255,120,0.1)] p-0 overflow-hidden z-[300]">
        <div className="p-8 space-y-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded border transition-all duration-500 bg-accent/5 border-accent/20 shadow-[0_0_10px_rgba(0,255,120,0.1)]", step.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                {PRO_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === currentStep ? "w-6 bg-accent" : "w-2 bg-white/10"
                    )} 
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black font-headline uppercase italic tracking-tighter text-accent">
                {step.title}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                Institutional Protocol Step {currentStep + 1} of {PRO_STEPS.length}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="min-h-[140px] animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-sm font-bold leading-relaxed mb-4 text-foreground/90 italic border-l-2 border-accent/30 pl-4">
              &quot;{step.description}&quot;
            </p>
            {step.content}
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 sm:justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-[9px] font-black uppercase tracking-widest h-9 px-4 hover:bg-white/5 disabled:opacity-0"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < PRO_STEPS.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="h-9 px-6 text-[10px] font-black uppercase tracking-widest gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 border-0"
                >
                  Continue <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="h-9 px-8 text-[10px] font-black uppercase tracking-widest gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-0"
                >
                  Authorize Terminal <Zap className="w-3.5 h-3.5 fill-current" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
        
        <div className="h-1 bg-white/5 flex">
          <div 
            className="h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgba(0,255,120,0.5)]" 
            style={{ width: `${((currentStep + 1) / PRO_STEPS.length) * 100}%` }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
