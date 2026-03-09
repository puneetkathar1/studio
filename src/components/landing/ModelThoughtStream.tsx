'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogLine {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'success' | 'system';
  content: string;
}

const THOUGHT_TEMPLATES = [
  { type: 'info', content: 'Ingesting Polymarket CLOB snapshot for node_0x82...' },
  { type: 'info', content: 'Computing SPS (Signal Probability Score) basis: 0.842' },
  { type: 'system', content: 'Macro Signal Ingested: US CPI YoY (Value: 3.4 | Δ: +0.02)' },
  { type: 'info', content: 'Re-weighting CMCI Scalar for Economics cluster...' },
  { type: 'success', content: 'TQS Threshold Check: NODE_BTC_100K (TQS: 0.024 | Stance: BET)' },
  { type: 'warn', content: 'High Sigma detected in Kalshi Politics ladder. Widening fair envelope.' },
  { type: 'info', content: 'Convergence Scanner identified Δ-Basis: 0.042c between venues.' },
  { type: 'system', content: 'Oracle Consensus Verified: 99.2% Nominal.' },
  { type: 'info', content: 'Extracting Alpha from 0xDE... Alpha Basis: +1.2%.' },
  { type: 'success', content: 'Signal Issued to Pro Feed: "Will S&P reach ATH" -> BET.' },
  { type: 'warn', content: 'Liquidity Depth (LQS) below threshold for node_0x11. Inhibiting signal.' },
  { type: 'info', content: 'Calculating theta_decay for June Fed Meeting contracts...' },
  { type: 'system', content: 'AES-256 Protocol Handshake: Node cluster synced.' },
];

export function ModelThoughtStream() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    const initialLogs: LogLine[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `init-${i}`,
      timestamp: new Date(Date.now() - (10 - i) * 5000).toISOString().slice(11, 19),
      type: 'info',
      content: 'Initializing Discovery Node connection...',
    }));
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const template = THOUGHT_TEMPLATES[Math.floor(Math.random() * THOUGHT_TEMPLATES.length)];
      const newLog: LogLine = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().slice(11, 19),
        type: template.type as any,
        content: template.content,
      };

      setLogs((prev) => [...prev.slice(-14), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-[400px]">
      <div className="h-10 bg-[#0A0C12] border-b border-white/5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Model Thought Stream v4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-bold text-accent uppercase">Engine: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-[8px] font-bold text-muted-foreground uppercase">TQS Scalar: 0.024</span>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[10px] space-y-1 overflow-y-auto no-scrollbar selection:bg-primary/30"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className="text-muted-foreground/40 shrink-0">[{log.timestamp}]</span>
            <span className={cn(
              "font-bold uppercase shrink-0 w-12",
              log.type === 'info' && 'text-primary/60',
              log.type === 'warn' && 'text-destructive/60',
              log.type === 'success' && 'text-accent/60',
              log.type === 'system' && 'text-white/40'
            )}>
              {log.type}
            </span>
            <span className={cn(
              "leading-relaxed",
              log.type === 'success' ? 'text-accent' : 
              log.type === 'warn' ? 'text-destructive' : 
              'text-foreground/80'
            )}>
              {log.content}
            </span>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground/40">[{new Date().toISOString().slice(11, 19)}]</span>
          <div className="w-2 h-4 bg-primary/50 animate-pulse" />
        </div>
      </div>

      <div className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center px-4 justify-between">
        <div className="flex gap-4">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Latency: 12ms</span>
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Throughput: 1.4k events/s</span>
        </div>
        <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Institutional Data Stream Link Active</span>
      </div>
    </div>
  );
}
