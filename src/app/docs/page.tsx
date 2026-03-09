'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  BookOpen, 
  Target, 
  Zap, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Lock, 
  Scale, 
  Info,
  ChevronRight,
  BrainCircuit,
  Database,
  Radar,
  ArrowRight,
  AlertTriangle,
  Layers,
  Waves,
  Timer,
  Terminal,
  RefreshCcw,
  Globe,
  Fingerprint,
  Briefcase,
  Crosshair,
  History,
  Repeat,
  ArrowRightLeft,
  Maximize2,
  Users,
  ShieldAlert,
  Skull,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProtocolStep } from '@/components/intelligence/ProtocolStep';
import { ExecutionProtocolSOP } from '@/components/intelligence/ExecutionProtocolSOP';

const INDICATOR_DETAILS: Record<string, { 
  label: string, 
  formula?: string, 
  desc: string, 
  function: string, 
  usage: string, 
  alphaImpact: string 
}> = {
  "SPS": {
    label: "Structural Pressure Score",
    formula: "P(H|E)",
    desc: "Bayesian Inference identifying if price movement is thin noise or aggressive capital commitment.",
    function: "Filters 'Ghost Volatility' by weighing every price tick against orderbook depth exhausted during the move.",
    usage: "Directly controls the TQS floor. If SPS is low, the system remains in WAIT even if EV is positive.",
    alphaImpact: "Critical for avoiding liquidity traps. It ensures the 'Alpha Basis' is backed by actual institutional capital flow."
  },
  "CCI": {
    label: "Confidence Consistency Index",
    formula: "1/σ_roll",
    desc: "Measures price smoothness. High CCI indicates robust consensus; low CCI indicates fragile liquidity.",
    function: "Calculates the rolling standard deviation of price discovery across a 15-minute window.",
    usage: "Used to determine signal stability. High CCI allows for larger 'Standard Unit' sizing.",
    alphaImpact: "High-CCI markets indicate a 'Firm Consensus,' reducing the likelihood of sudden mean-reversion spikes."
  },
  "EVS": {
    label: "Expected Value Score",
    formula: "FV - MP",
    desc: "Primary delta between our Fair Value and the current Venue Midpoint. Basis for alpha extraction.",
    function: "Measures the distance between the model's derived Fair Value and the live market bid/ask midpoint.",
    usage: "The 'Engine Prime.' No BET signal can be issued without an EVS score crossing the threshold.",
    alphaImpact: "Directly quantifies the profit potential per unit staked. It is the raw 'Edge' metric."
  },
  "MIS": {
    label: "Market Inefficiency Score",
    formula: "D_LP(P||Q)",
    desc: "Kullback-Leibler divergence detecting systemic bias in sentiment relative to historical resolution.",
    function: "Scans for 'Crowd Hallucinations' where retail sentiment ignores historical probability base rates.",
    usage: "Used to toggle directionality (YES/NO). It favors the side where the market is most 'wrong' statistically.",
    alphaImpact: "Identifies non-linear opportunities where the payout massively outweighs the risk due to public bias."
  },
  "LQS": {
    label: "Liquidity Quality Score",
    desc: "Depth-weighted spread analysis protecting nodes from thin-tail traps and manipulation.",
    function: "Analyzes the top 10 levels of the CLOB (Central Limit Order Book) to verify exit liquidity.",
    usage: "Acts as an 'Inhibitor.' If LQS is below nominal levels, execution is blocked to prevent slippage erosion.",
    alphaImpact: "Protects realized PnL. Prevents 'Paper Alpha' that disappears the moment you attempt to fill a position."
  },
  "TVS": {
    label: "Timing Value Score",
    formula: "∂P / ∂t",
    desc: "Theta sensitivity identifying the optimal entry window relative to the event horizon.",
    function: "Models price decay and discovery speed as the event resolution timestamp approaches.",
    usage: "Determines if 'Alpha Capture' is premature. Prevents capital from being locked in 'Dead Momentum' zones.",
    alphaImpact: "Maximizes IRR (Internal Rate of Return) by focusing on signals with immediate convergence potential."
  },
  "RRS": {
    label: "Regime Risk Score",
    desc: "Multi-factor Beta analysis monitoring external shocks (Macro, News) that disrupt model assumptions.",
    function: "Cross-references market discovery with global Macro volatility indices.",
    usage: "Widens the 'Fair Value Envelope.' High RRS increases uncertainty, requiring a higher EVS to trigger a BET.",
    alphaImpact: "The 'Safety Valve.' Prevents signals from being issued during systemic shocks like Fed announcements."
  },
  "BDS": {
    label: "Belief Divergence Score",
    desc: "Polarity analysis of market participants. High BDS precedes high-volatility price discovery.",
    function: "Measures the concentration of volume between opposing outcome clusters.",
    usage: "Signals an 'Imminent Breakout.' High BDS indicates a 'Crowded Trade' reaching a breaking point.",
    alphaImpact: "Identifies 'Price Discovery' events before they happen, allowing for early positioning in the convergence path."
  },
  "SCS": {
    label: "Signal Clarity Score",
    formula: "SNR",
    desc: "Combined SNR (Signal-to-Noise) index. The final 'Confidence' gate for automated signal issuance.",
    function: "A composite index that divides the signal strength (Alpha) by the market entropy (Noise).",
    usage: "The 'Final Gatekeeper.' Determines if a signal is broadcast to the Alpha Stream or kept in Audit.",
    alphaImpact: "Ensures only the highest fidelity signals are presented to the user, maintaining platform win rates."
  },
  "IAS": {
    label: "Invalidation Alert Score",
    desc: "Proximity scan to the thesis breakdown threshold. Serves as a real-time institutional stop-loss proxy.",
    function: "Calculates the exact price level at which the original model logic is proven statistically false.",
    usage: "Powers the 'Thesis Broken' notification in the Audit Journey. It signals when to liquidate a position.",
    alphaImpact: "Capital preservation. It ensures that 'Small Wins' aren't turned into 'Large Losses' through model drift."
  },
  "PRS": {
    label: "Predictive Reliability",
    desc: "Rolling Bayesian Accuracy weight. Penalizes or promotes models based on 30-day sector performance.",
    function: "A feedback loop that analyzes every previous platform signal against its final outcome.",
    usage: "Dynamic Weighting. If the 'Politics' model is underperforming, its signals are inhibited automatically.",
    alphaImpact: "Injects accountability. It ensures the platform 'learns' from market regime shifts in real-time."
  },
  "ECS": {
    label: "Edge Capture Score",
    desc: "Calculates the delta between theoretical profit at issue and actual realized profit at settlement.",
    function: "A post-facto audit metric that compares the initial EVS to the final settlement units.",
    usage: "Used to calibrate future TQS scalars. It identifies if the platform is 'Overpromising' alpha.",
    alphaImpact: "The ultimate 'Realism' metric. It bridges the gap between quantitative theory and execution reality."
  },
  "DCS": {
    label: "Discipline Consistency",
    desc: "Compliance audit verifying the signal was issued within risk parameters.",
    function: "Verifies that the signal was issued while all 16 indicators were within institutional safety bounds.",
    usage: "Accountability metric. Prevents 'Revenge Trading' or 'Chase Signals' from entering the public ledger.",
    alphaImpact: "Ensures the 'System Snapshot' win rates are derived from a consistent, repeatable rule-set."
  },
  "PCS": {
    label: "Portfolio Correlation",
    desc: "Pearson coefficient detecting hidden overexposure across correlated event groups.",
    function: "Scans all active signals to find shared dependencies (e.g., three bets all depending on one Fed rate).",
    usage: "Risk management. Reduces position sizes if the 'System Variance' becomes too concentrated.",
    alphaImpact: "Prevents 'Total Portfolio Blowouts' during correlated market events."
  },
  "ARS": {
    label: "Asymmetric Risk Score",
    desc: "Fisher Skewness (3rd Moment) analysis favoring bets where potential upside dwarves statistical downside.",
    function: "Analyzes the 'Tail Risk' of a contract. Favors low-probability/high-payout bets with high alpha basis.",
    usage: "Search for 'Moonshots.' It identifies signals with 'Positive Skew' where one win pays for ten losses.",
    alphaImpact: "Drives exponential ROI growth by identifying high-convexity opportunities overlooked by the crowd."
  },
  "HSS": {
    label: "Horizon Sensitivity",
    desc: "Monte-Carlo simulation of event-delays (recounts, court stays) that erode the bet's ROI.",
    function: "Simulates 'Event Horizon Drift' scenarios to see how time delays impact capital efficiency.",
    usage: "Risk rating. Signals with high HSS are given a 'Wait' status if court delays or recounts are likely.",
    alphaImpact: "Ensures capital is not 'Trapped' in legal or political deadlocks for months without resolution."
  }
};

function DocSection({ title, icon: Icon, children, color = "primary" }: any) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className={cn("p-2 rounded border", color === "primary" ? "bg-primary/10 border-primary/20 text-primary" : "bg-accent/10 border-accent/20 text-accent")}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black font-headline uppercase tracking-tighter italic">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

function IndicatorDoc({ short }: { short: string }) {
  const details = INDICATOR_DETAILS[short];
  if (!details) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3 text-primary" />
          </div>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="text-[10px] font-black font-mono border-primary/30 text-primary uppercase">{short}</Badge>
            {details.formula && <span className="text-[9px] font-mono text-muted-foreground opacity-40">{details.formula}</span>}
          </div>
          <h4 className="text-sm font-bold text-foreground mb-1">{details.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
            {details.desc}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#0A0C12] border-white/10 text-foreground shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black font-headline tracking-tight uppercase italic">
                {details.label} <span className="text-muted-foreground ml-1">({short})</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Institutional Intelligence Audit v4.2
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Quantitative Function</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/80 font-medium">
                  {details.function}
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alpha Contribution</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/80 font-medium italic">
                  "{details.alphaImpact}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Decision Logic Usage</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                  {details.usage}
                </p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[9px] font-black text-muted-foreground uppercase">Mathematical Basis</span>
                <div className="text-xl font-black font-mono text-foreground">
                  {details.formula || 'DETERMINISTIC_LOGIC'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4">
            <div className="p-2 bg-accent/10 rounded-full text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-accent tracking-widest">Alpha Auditor Briefing</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                {details.desc} This indicator is a mandatory factor in the <strong>Unified Stance Equation</strong>. It cannot be bypassed for signal issuance.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Subscriber Key: VERIFIED</span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol: NOMINAL</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DocsPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-16 py-12 px-4 animate-in fade-in duration-1000 selection:bg-primary/30">
      {/* HEADER: SYSTEM BRIEFING */}
      <header className="space-y-6 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.3em] px-3">
                Protocol v4.2 Internal
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-bold text-accent uppercase">Audit Verified</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter italic uppercase leading-none">
              Intelligence <br />
              <span className="text-primary">Briefing</span>.
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              This Standard Operating Procedure (SOP) details the hybrid deterministic-AI engine driving Predictive Insights Pro. Use this guide to master our 16-indicator convergence model and external alpha API integration.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <ExecutionProtocolSOP />
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-2 text-center lg:text-right">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Autonomous Sync Latency</span>
            <div className="text-3xl font-black font-mono text-accent">12ms</div>
            <span className="text-[8px] font-bold text-accent/60 uppercase">AES-256 GCM Cluster Active</span>
          </div>
        </div>
      </header>

      {/* CLARIFICATIONS & USER CLASSIFICATION */}
      <DocSection title="User Classification & Workflow" icon={Users} color="accent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Normal User Protocol */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Globe className="w-32 h-32 text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded border border-white/10 text-muted-foreground">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Normal User Protocol</h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              The "Discovery Protocol" is designed for transparency and research. Normal users utilize the platform to monitor global sentiment and verify platform credibility.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { label: 'MARKET DISCOVERY', icon: Globe, desc: 'Identify volume leaders and trending categorical nodes (Politics, Crypto, Macro).' },
                { label: 'PERFORMANCE VERIFICATION', icon: ShieldCheck, desc: 'Browse the Public Ledger to verify historical accuracy and win-rate benchmarks.' },
                { label: 'TERMINAL OBSERVATION', icon: Activity, desc: 'Utilize the Intelligence Terminal to monitor real-time probability curves.' },
                { label: 'METHODOLOGY EDUCATION', icon: Info, icon: Info, desc: 'Utilize Docs to understand Brier Score calibration and TQS scalar fundamentals.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <item.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-foreground">{item.label}</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro User Institutional Workflow */}
          <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Zap className="w-32 h-32 text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded border border-primary/30 text-primary">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-primary">Pro Institutional Workflow</h3>
                <span className="text-[8px] font-black uppercase text-accent">High-Conviction Execution Layer</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Pro users utilize the platform as an automated decision support system. They follow a strict 6-step SOP to extract alpha while utilizing the institutional API for programmatic integration.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { label: 'ALPHA STREAM MONITORING', icon: Zap, desc: 'Isolate signals where TQS θ_bet crosses the 0.02 conviction floor.' },
                { label: 'API INTEGRATION', icon: Cpu, desc: 'Utilize the Institutional API for programmatic ingestion of signals and raw scalars.' },
                { label: 'PROCESS ENFORCEMENT', icon: ShieldAlert, desc: 'Establish Guardrails to automatically soft-block impulsive or non-compliant moves.' },
                { label: 'PORTFOLIO RATIONALITY', icon: Briefcase, desc: 'Aggregate exposure via the EV Monitor to detect hidden narrative correlations.' },
                { label: 'ARBITRAGE EXECUTION', icon: Repeat, desc: 'Utilize the Δ-Basis Scanner to lock in cross-venue price decoupling.' },
                { label: 'MACRO RE-WEIGHTING', icon: BarChart3, desc: 'Align TQS scalars with global volatility regimes via the Macro Lab.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <item.icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-foreground">{item.label}</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DocSection>

      {/* CORE SOP: THE USER JOURNEY */}
      <DocSection title="Standard Operating Procedure (SOP)" icon={Terminal} color="primary">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'DISCOVER', icon: Globe, color: 'text-primary', desc: 'Scan the Global Matrix for volume leaders and high-liquidity categorical nodes.' },
            { step: '02', title: 'AUDIT', icon: Radar, color: 'text-accent', desc: 'Enter the Audit Journey to analyze historical price discovery and original TQS basis.' },
            { step: '03', title: 'LOG', icon: Crosshair, color: 'text-accent', desc: 'Click "Log Personal Entry" to record your venue fill price and direction (YES/NO).' },
            { step: '04', title: 'MONITOR', icon: Activity, color: 'text-primary', desc: 'Track your live divergence and target convergence progress in real-time.' },
            { step: '05', title: 'REFINE', icon: Target, color: 'text-primary', desc: 'Verify your Brier Score in the Portfolio Node to benchmark your precision vs the model.' },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 group hover:border-primary/30 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-muted-foreground/40">{item.step}</span>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <h4 className="text-sm font-black uppercase italic">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* THE EXTERNAL ALPHA API SECTION */}
      <DocSection title="The External Alpha API" icon={Cpu} color="accent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Integrate PI-Pro intelligence directly into your proprietary execution engines. The **External Alpha API** provides high-frequency programmatic access to the terminal's thinking matrix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-black uppercase text-primary">WebSocket Push Layer</h4>
                </div>
                <p className="text-[10px] text-muted-foreground">Sub-100ms delivery of θ_bet threshold crossings and real-time behavioral risk transitions.</p>
              </div>
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <History className="w-4 h-4 text-accent" />
                  <h4 className="text-xs font-black uppercase text-accent">Historical Replay API</h4>
                </div>
                <p className="text-[10px] text-muted-foreground">Request high-fidelity "Matrix Snapshots" from any historical microsecond for quant-suite backtesting.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-black/40 border border-accent/20 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Institutional API Status</span>
            <div className="text-4xl font-black font-mono text-accent">ENABLED</div>
            <p className="text-[9px] text-muted-foreground italic">
              "Endpoint: wss://alpha.pip-pro.ai/v1/stream"
            </p>
            <Button variant="outline" className="w-full border-accent/30 text-accent text-[9px] font-black uppercase h-9" disabled>
              View API Spec (Pro Only)
            </Button>
          </div>
        </div>
      </DocSection>

      {/* THE 16 INDICATORS */}
      <DocSection title="The Intelligence Stack (1-16)" icon={BrainCircuit}>
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Our hybrid engine utilizes 16 unique quantitative dimensions to calculate the **Fair Probability Envelope**. Click any indicator for institutional deep-dive logic.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(INDICATOR_DETAILS).map(short => (
              <IndicatorDoc key={short} short={short} />
            ))}
          </div>
        </div>
      </DocSection>

      {/* INFRASTRUCTURE */}
      <DocSection title="Autonomous Discovery Node" icon={Database}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Predictive Insights Pro orchestrates 1,482 geographically distributed nodes to harvest categorical liquidity and macro signals autonomously.
            </p>
            <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Sync Cycle</span>
                <span className="text-[10px] font-bold text-primary">Autonomous (Background)</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-accent">12ms</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Security</span>
                <span className="text-[10px] font-bold text-foreground">AES-256 GCM</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <RefreshCcw className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Ingestion Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              "The Discovery Cluster maintains sub-second normalization across decentralized and regulated protocols. Intelligence is verified via multi-oracle quorum consensus."
            </p>
          </div>
        </div>
      </DocSection>

      {/* PROTOCOL STEP 04: FINAL */}
      <div className="pt-12">
        <ProtocolStep 
          step={4}
          totalSteps={4}
          title="Methodology Education"
          description="Protocol Loop Complete. You now possess the foundational knowledge to utilize the Discovery Matrix effectively. Return to Step 01 to identify new alpha."
          nextStepLabel="Return to Global Discovery"
          nextStepHref="/markets"
          icon={Globe}
        />
      </div>

      {/* TACTICAL DISCLAIMER */}
      <section className="pt-16 border-t border-dashed border-white/10 space-y-8">
        <div className="flex flex-col md:flex-row items-start gap-8 bg-destructive/5 border border-destructive/20 p-8 rounded-2xl">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive shrink-0">
            <Scale className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-black font-headline uppercase tracking-tight text-destructive">Tactical Disclaimer</h2>
            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed font-medium">
              <p><strong>1. PROBABILISTIC NATURE:</strong> All platform indicators (SPS, EVS, TQS) are mathematical estimates based on historical data and real-time orderflow. They represent probability, not certainty. Past performance is not indicative of future results.</p>
              <p><strong>2. EXECUTION RISK:</strong> Realized PnL may differ significantly from Theoretical Alpha due to venue slippage, platform fees, orderbook exhaustion, and protocol latency. The "Realism Simulations" provided are estimates only.</p>
              <p><strong>3. DATA INTEGRITY:</strong> Ledger entries and signals are committed based on ingestion from external venues. Finality occurs only once venue settlement is verified by the platform's distributed oracle quorum. We do not guarantee the uptime or accuracy of third-party venue APIs.</p>
              <p><strong>4. NO FINANCIAL ADVICE:</strong> Predictive Insights Pro is a decision support tool for quantitative researchers. No content on this platform constitutes financial, investment, or legal advice. Users are solely responsible for their own capital commitment and risk management.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-black text-lg">P</div>
            <span className="text-xl font-headline font-bold tracking-tighter uppercase">Predictive<span className="text-primary">Insights</span></span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest max-w-md">
            The standard operating standard for the global prediction matrix.
          </p>
          <Button size="lg" className="h-12 px-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-3" asChild>
            <Link href="/terminal">
              <ArrowRight className="w-4 h-4" /> Return to Terminal
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
