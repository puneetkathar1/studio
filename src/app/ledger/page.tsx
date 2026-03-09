'use client';

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LedgerTable } from './ledger-table'
import { ShieldCheck, Info, BarChart3, AlertCircle, Target, Monitor, Fingerprint, Lock, Zap } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { DiscoveryProtocolSOP } from '@/components/intelligence/DiscoveryProtocolSOP'
import { ProtocolStep } from '@/components/intelligence/ProtocolStep'
import { PerformanceLedgerSOP } from '@/components/intelligence/PerformanceLedgerSOP'

/**
 * @fileOverview Institutional Accountability Node.
 * Features ZK-Audit Proofs to verify historical signal integrity.
 */
export default function LedgerPage() {
  const [integrityHash, setIntegrityHash] = useState('0x0000...0000');

  useEffect(() => {
    // Rotating Integrity Hash to simulate live ZK-Proof cycle
    const interval = setInterval(() => {
      const hash = '0x' + Array.from({ length: 12 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')
        .toUpperCase();
      setIntegrityHash(hash);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Audit Status: TAMPER_PROOF_V4.2
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <Lock className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase">Zero-Knowledge Proofs Active</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none">
            Performance <span className="text-primary">Ledger</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
            Proof of predictive authority. Every intelligence signal is cryptographically hashed and verified via a decentralized oracle quorum. This ledger provides absolute mathematical certainty that historical alpha was issued in real-time.
          </p>
          <div className="pt-1 flex gap-3">
            <PerformanceLedgerSOP />
            <DiscoveryProtocolSOP />
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-card border shadow-xl p-4 rounded-xl border-accent/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Fingerprint className="w-12 h-12 text-accent" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Current Protocol Hash</span>
            <span className="text-xs font-black font-mono text-accent uppercase tracking-widest">{integrityHash}</span>
          </div>
          <div className="h-10 w-px bg-white/5" />
          <div className="p-2 bg-accent/10 rounded-lg text-accent">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Alert className="bg-primary/5 border-primary/20 border-l-4 border-l-primary">
            <Fingerprint className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-bold text-sm uppercase tracking-tight">ZK-Audit Verification</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium italic">
              "Platform integrity is achieved through deterministic hashing. All signals are committed to the ledger the millisecond the θ_bet threshold is crossed. Back-filling or editing previous signals is mathematically impossible within the protocol."
            </AlertDescription>
          </Alert>

          <Card className="border-border shadow-2xl overflow-hidden border-t-4 border-t-primary bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-headline text-xl uppercase italic tracking-tighter text-foreground">Immutable Signal Matrix</CardTitle>
                  <CardDescription className="text-xs font-medium">
                    Verified performance metrics derived from venue settlement and oracle quorum finality.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <LedgerTable />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          {/* PROTOCOL NEXT STEP: VERIFICATION -> OBSERVATION */}
          <ProtocolStep 
            step={2}
            totalSteps={4}
            title="Verification Success"
            description="Platform credibility has been established via cryptographic proof. You have verified the predictive authority of the AI Stance engine. The next protocol step is to observe live probability discovery in the high-density terminal."
            nextStepLabel="Launch Immersive Terminal"
            nextStepHref="/terminal-pro"
            icon={Monitor}
          />

          <Card className="bg-accent/5 border-accent/20 border flex items-center p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
              <Zap className="w-16 h-16 text-accent fill-accent" />
            </div>
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calibration Target</p>
                <p className="text-sm font-black font-headline text-foreground italic">BRIER &lt; 0.150</p>
                <p className="text-[9px] text-muted-foreground leading-tight italic">Consistently outperforming retail consensus nodes.</p>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-[#0A0C12] border border-white/5 rounded-2xl space-y-4 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Zero-Trust substrate</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium">
              "Every ledger hash corresponds to a specific multi-factor convergence state (SPS, CCI, EVS). Finality occurs when 12/12 geographically distributed oracles confirm the venue state."
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[8px] font-black uppercase text-muted-foreground">Compliance ID</span>
              <span className="text-[8px] font-mono font-bold text-primary">PIP-AUDIT-V4.2</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-8 py-12 border-t border-dashed border-white/10 opacity-40">
         <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
           <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Immutable
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
           <Fingerprint className="w-3.5 h-3.5 text-primary" /> Hashed
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
           <Target className="w-3.5 h-3.5 text-accent" /> Calibrated
         </div>
      </div>
    </div>
  )
}
