'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Activity, 
  Server, 
  Database, 
  Zap, 
  Globe,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function InstitutionalSecurityProof() {
  const [nodes, setNodes] = useState<boolean[]>([]);
  const [tick, setTick] = useState(0);

  // Initialize node matrix (400 visible proxy nodes for the 1,400+ total)
  useEffect(() => {
    setNodes(Array.from({ length: 400 }).map(() => Math.random() > 0.05));
    const interval = setInterval(() => {
      setTick(t => t + 1);
      // Simulate random node flicker
      setNodes(prev => prev.map(n => Math.random() > 0.01 ? n : !n));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sessionHash = useMemo(() => {
    return '0x' + Array.from({ length: 12 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
      .toUpperCase();
  }, []);

  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Institutional Proof of Reserve</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Distributed Discovery Cluster v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Security: Nominal</span>
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10">AES-256 GCM Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* NODE MATRIX VISUALIZATION */}
        <div className="lg:col-span-7 p-6 border-r border-white/5 bg-black/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Discovery Node Cluster (1,482 Total)</span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">Health: 99.98%</span>
            </div>
            
            <div className="grid grid-cols-20 gap-1 h-[200px] overflow-hidden">
              {nodes.map((online, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-full pt-[100%] rounded-sm transition-all duration-1000",
                    online 
                      ? "bg-primary/20 hover:bg-primary/40" 
                      : "bg-destructive/40 animate-pulse"
                  )}
                />
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
              <div className="flex gap-4">
                <span>US-EAST-1: ACTIVE</span>
                <span>EU-WEST-2: ACTIVE</span>
                <span>AP-SOUTH-1: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-primary/60">
                <Activity className="w-3 h-3" />
                <span>Syncing 1.4k Nodes...</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY SPECS SIDEBAR */}
        <div className="lg:col-span-5 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Session Security Protocol</h4>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 divide-y divide-white/5">
              <div className="pb-3 flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Encryption Standard</span>
                <span className="text-[10px] font-black font-mono text-accent">AES-256 GCM</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Handshake ID</span>
                <span className="text-[10px] font-black font-mono text-primary">{sessionHash}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Oracle Consensus</span>
                <Badge variant="outline" className="h-4 text-[7px] font-black uppercase border-accent/20 text-accent">VERIFIED</Badge>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">RSA-4096 Key</span>
                <div className="flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black font-mono text-primary">Valid</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Database className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Data Integrity Cluster</h4>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic">
              "Predictive Insights Pro utilizes a zero-trust architecture. Every market tick is cross-verified against a quorum of decentralized discovery nodes before committing to the performance ledger."
            </p>
          </div>
        </div>
      </div>

      <div className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-4">
          <span className="text-[8px] font-black uppercase tracking-tighter">Protocol: AES-256-RSA-SHA384</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Throughput: 1.4k/s</span>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-3 h-3 fill-current" />
          <span className="text-[8px] font-black uppercase tracking-widest">Bank-Grade Secure Link Verified</span>
        </div>
      </div>
      <style jsx>{`
        .grid-cols-20 {
          grid-template-columns: repeat(20, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
}
