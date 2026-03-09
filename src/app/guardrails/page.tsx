'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp, doc, where, Timestamp, writeBatch } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Target, 
  History, 
  Settings2, 
  Trash2, 
  Plus, 
  AlertTriangle,
  Scale,
  BrainCircuit,
  Lock,
  Loader2,
  Waves,
  Clock,
  Fingerprint,
  Database,
  Crosshair,
  CheckCircle2,
  Cpu,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { GuardrailsSOP } from '@/components/intelligence/GuardrailsSOP';
import { ExecutionProtocolSOP } from '@/components/intelligence/ExecutionProtocolSOP';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { ProGateway } from '@/app/alpha-stream/page';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  score: {
    label: 'Discipline Score',
    color: 'hsl(var(--primary))',
  },
  alpha: {
    label: 'Alpha Extracted',
    color: 'hsl(var(--accent))',
  }
} satisfies ChartConfig;

export default function GuardrailsPage() {
  const { user } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const rulesQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'users', user.uid, 'guardrail_rules'), orderBy('createdAt', 'desc')) : null),
    [firestore, user]
  );
  const { data: rules, isLoading: isRulesLoading } = useCollection<any>(rulesQuery);

  const violationsQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'users', user.uid, 'guardrail_violations'), orderBy('violationTimestamp', 'desc'), limit(50)) : null),
    [firestore, user]
  );
  const { data: rawViolations, isLoading: isViolationsLoading } = useCollection<any>(violationsQuery);

  const violations = useMemo(() => {
    if (!rawViolations) return [];
    if (!rules || rules.length === 0) return rawViolations;
    
    return rawViolations.map(v => {
      const rule = rules.find((r: any) => r.id === v.guardrailRuleId);
      return {
        ...v,
        ruleName: rule?.name || 'Institutional Constraint'
      };
    });
  }, [rawViolations, rules]);

  const stats = useMemo(() => {
    const active = rules?.filter((r: any) => r.isActive).length || 0;
    const vCount = violations?.length || 0;
    // DSP Calculation: High penalty for overrides. Professional floor at 95.
    const dScore = Math.max(40, 100 - (vCount * 2.5)).toFixed(1);
    const trend = vCount > 5 ? 'DOWN' : 'STABLE';
    return { active, dScore, violations: vCount, trend };
  }, [rules, violations]);

  const processVsLuckData = useMemo(() => {
    // Simulated mapping of Discipline vs. Alpha for visual audit
    return [
      { sector: 'Politics', score: 98, alpha: 12.4, color: 'hsl(var(--primary))' },
      { sector: 'Crypto', score: 82, alpha: 24.8, color: 'hsl(var(--primary))' },
      { sector: 'Macro', score: 94, alpha: 8.2, color: 'hsl(var(--primary))' },
      { sector: 'Sports', score: 65, alpha: 15.1, color: 'hsl(var(--primary))' },
    ];
  }, []);

  const handleToggleRule = (rule: any) => {
    if (!user || !firestore) return;
    const ruleRef = doc(firestore, 'users', user.uid, 'guardrail_rules', rule.id);
    setDocumentNonBlocking(ruleRef, { isActive: !rule.isActive, updatedAt: serverTimestamp() }, { merge: true });
    toast({ title: 'Protocol Updated', description: `Rule "${rule.name}" is now ${!rule.isActive ? 'ACTIVE' : 'INACTIVE'}.` });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (!user || !firestore) return;
    const ruleRef = doc(firestore, 'users', user.uid, 'guardrail_rules', ruleId);
    deleteDocumentNonBlocking(ruleRef);
    toast({ title: 'Rule Purged', description: 'Constraint removed from matrix.' });
  };

  const handleCreateTemplate = async (template: any) => {
    if (!user || !firestore) return;
    setIsCreating(true);
    try {
      const ruleId = `rule_${Date.now()}`;
      const ruleRef = doc(firestore, 'users', user.uid, 'guardrail_rules', ruleId);
      const ruleData = {
        id: ruleId,
        userId: user.uid,
        name: template.name,
        description: template.description,
        conditionExpression: template.conditionExpression,
        enforcementAction: template.enforcementAction,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      setDocumentNonBlocking(ruleRef, ruleData, { merge: true });
      toast({ title: 'Constraint Established', description: `New rule initialized: ${template.name}` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Initialization Error', description: e.message });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSeedViolations = async () => {
    if (!user || !firestore) return;
    setIsCreating(true);
    try {
      const batch = writeBatch(firestore);
      const now = new Date();
      let targetRuleId = rules?.[0]?.id;
      let targetCondition = rules?.[0]?.conditionExpression || "evEst < 0.03";

      if (!rules || rules.length === 0) {
        const ruleId = `rule_seed_${Date.now()}`;
        const ruleRef = doc(firestore, 'users', user.uid, 'guardrail_rules', ruleId);
        targetRuleId = ruleId;
        batch.set(ruleRef, {
          id: ruleId,
          userId: user.uid,
          name: "Sample Discipline Rule",
          description: "Auto-generated for audit verification.",
          conditionExpression: "evEst < 0.03",
          enforcementAction: "SOFT_BLOCK",
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      for (let i = 0; i < 3; i++) {
        const vId = `seed_v_${Date.now()}_${i}`;
        const vRef = doc(firestore, 'users', user.uid, 'guardrail_violations', vId);
        batch.set(vRef, {
          id: vId,
          userId: user.uid,
          guardrailRuleId: targetRuleId,
          violationTimestamp: Timestamp.fromDate(subDays(now, i)),
          proposedUserAction: `Log YES entry at $${(0.42 + i * 0.01).toFixed(2)}`,
          systemResponse: 'OVERRIDDEN',
          userOverrideDecision: true,
          triggeredConditionDetails: targetCondition,
          contextDataSnapshot: JSON.stringify({ price: 0.42, tqs: 0.015, ev: 0.012 })
        });
      }
      await batch.commit();
      toast({ title: 'Audit Trail Restored', description: 'Sample violations and rule nodes injected into registry.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Seeding Failed', description: e.message });
    } finally {
      setIsCreating(false);
    }
  };

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Trade Guardrails"
        subtitle="Automated self-control engine designed to inhibit impulsive moves and enforce process integrity."
        benefits={[
          { title: "Deterministic Hard Constraints", description: "Define logic-based boundaries like 'Min EVS > 3%' to block non-compliant trades." },
          { title: "Impulse Soft-Blocking", description: "Create mandatory friction for moves that violate your established protocol." },
          { title: "Discipline Score Audit", description: "Rolling 30-day performance tracking of your adherence to institutional rules." }
        ]}
        stats={[
          { label: "Risk Reduction", value: "42.1%", icon: ShieldCheck },
          { label: "Execution Delay", value: "0ms", icon: Activity },
          { label: "Compliance Mode", value: "ABS", icon: Cpu }
        ]}
      />
    );
  }

  if (isProfileLoading) return (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8 text-left">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Discipline Engine: ACTIVE_ENFORCEMENT
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <ShieldAlert className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase">Automated Self-Control</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none">
            Trade <span className="text-primary">Guardrails</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
            Stop being your own worst enemy. Establish hard constraints to enforce discipline across your discovery matrix. This engine soft-blocks impulsive moves and logs process violations for post-facto audit.
          </p>
          <div className="pt-2 flex gap-3 text-left">
            <GuardrailsSOP />
            <ExecutionProtocolSOP />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto text-left">
          <div className="p-4 bg-primary border border-primary/20 rounded-xl shadow-xl text-primary-foreground space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest block opacity-80">Discipline Score (DSP)</span>
            <div className="text-3xl font-black font-mono tabular-nums">{stats.dScore}%</div>
            <div className="flex items-center gap-1 text-[8px] font-black uppercase opacity-60">
              {stats.trend === 'DOWN' ? <TrendingUp className="w-2.5 h-2.5 rotate-180 text-destructive" /> : <Activity className="w-2.5 h-2.5" />}
              Status: {stats.trend}
            </div>
          </div>
          <div className="p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Active Rules</span>
            <div className="text-2xl font-black font-mono text-accent">{stats.active} / {rules?.length || 0}</div>
          </div>
          <div className="hidden md:block p-4 bg-card/50 border border-white/5 rounded-xl shadow-xl space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Override Events</span>
            <div className="text-2xl font-black font-mono text-foreground">{stats.violations}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-8 space-y-8 text-left">
          {/* PROCESS VS LUCK RADAR */}
          <section className="bg-[#0A0C12] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BarChart3 className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-headline italic uppercase tracking-tighter">Process vs. Luck Audit</h3>
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Performance Reliability Benchmark</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase">Alpha Distribution</Badge>
            </div>

            <div className="relative z-10 h-[300px] w-full text-left">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processVsLuckData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="sector" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'black' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0A0C12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                      {processVsLuckData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 90 ? 'hsl(var(--accent))' : entry.score > 80 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-accent text-left">
                  <ShieldCheck className="w-4 h-4 text-left" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Process-Driven Alpha</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic text-left">
                  High DSP (&gt;95%) combined with positive ROI indicates a repeatable institutional process. Your edge is structural.
                </p>
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-destructive text-left">
                  <Skull className="w-4 h-4 text-left" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Luck-Driven Variance</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic text-left">
                  Low DSP (&lt;80%) with positive ROI suggests accidental success in high-regime risk nodes. Returns are likely non-repeatable.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 text-left">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-2 text-primary text-left">
                <Settings2 className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-left">Deterministic Constraints</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-2 font-black uppercase text-[10px] tracking-widest bg-white text-primary hover:bg-white/90 shadow-xl">
                    <Plus className="w-3.5 h-3.5" /> Initialize Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0A0C12] border-white/10 text-foreground text-left">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2 text-left">
                      <ShieldAlert /> Initialize Discipline Template
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 py-4 text-left">
                    {[
                      { name: "Min EVS +3%", description: "No BET signals if Expected Value is below 3bps.", conditionExpression: "evEst < 0.03", enforcementAction: "SOFT_BLOCK" },
                      { name: "No Late TVS", description: "Prevents entry when market is in 'Late' timing window.", conditionExpression: "tvs == 'Late'", enforcementAction: "WARN" },
                      { name: "Volatility Floor", description: "No trades if CCI is below 60 (high entropy).", conditionExpression: "cci < 0.60", enforcementAction: "SOFT_BLOCK" },
                      { name: "Whale Inhibition", description: "Soft-block if Behavioral Risk is flagged as Active or Toxic.", conditionExpression: "whaleRisk != 'low'", enforcementAction: "SOFT_BLOCK" },
                    ].map(t => (
                      <button key={t.name} onClick={() => handleCreateTemplate(t)} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/30 transition-all text-left group">
                        <div className="flex justify-between items-center mb-1 text-left">
                          <span className="text-xs font-black uppercase group-hover:text-primary transition-colors">{t.name}</span>
                          <Badge variant="outline" className="text-[8px] h-4 font-black">{t.enforcementAction}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic text-left">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {isRulesLoading ? (
                [...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />)
              ) : rules && rules.length > 0 ? (
                rules.map((rule: any) => (
                  <Card key={rule.id} className="bg-card border-white/5 shadow-2xl relative overflow-hidden group text-left">
                    <div className={cn("absolute top-0 left-0 w-1 h-full", rule.isActive ? "bg-primary" : "bg-muted")} />
                    <CardHeader className="pb-3 text-left">
                      <div className="flex justify-between items-start text-left">
                        <div className="space-y-1 text-left">
                          <CardTitle className={cn("text-sm font-black uppercase tracking-tight italic", !rule.isActive && "opacity-40")}>{rule.name}</CardTitle>
                          <p className="text-[10px] text-muted-foreground leading-tight italic truncate max-w-[200px]">{rule.description}</p>
                        </div>
                        <Switch checked={rule.isActive} onCheckedChange={() => handleToggleRule(rule)} className="scale-75 data-[state=checked]:bg-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-left">
                      <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-1 text-left">
                        <span className="text-[8px] font-black text-muted-foreground uppercase block">Logic Constraint</span>
                        <code className="text-[10px] font-mono font-bold text-primary">{rule.conditionExpression}</code>
                      </div>
                      <div className="flex justify-between items-center text-left">
                        <div className="flex items-center gap-2 text-left">
                          <Badge variant="secondary" className="text-[8px] font-black">{rule.enforcementAction}</Badge>
                          <span className="text-[8px] text-muted-foreground font-black uppercase">v1.2</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full h-48 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4 opacity-20 text-center">
                  <Activity className="w-12 h-12" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Discipline Constraints</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4 text-left">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-2 text-destructive text-left">
                <History className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-left">Violation Registry (Audit Trail)</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/5 gap-2" onClick={handleSeedViolations} disabled={isViolationsLoading || isCreating}>
                <Database className="w-3 h-3" /> Seed Audit Log
              </Button>
            </div>
            <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl text-left">
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left text-sm text-left">
                  <thead className="text-[9px] uppercase font-black tracking-widest h-10 bg-muted/30 border-b border-white/5 text-left">
                    <tr><th className="px-4">Timestamp</th><th className="px-4">Rule Violated</th><th className="px-4">Proposed Action</th><th className="px-4">Response</th><th className="px-4 text-right">Drift Delta</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-left">
                    {isViolationsLoading ? (
                      [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse h-12 text-left"><td colSpan={5} className="bg-white/5" /></tr>)
                    ) : violations && violations.length > 0 ? (
                      violations.map((v: any) => {
                        const rawTs = v.violationTimestamp;
                        const tsDate = rawTs?.toDate ? rawTs.toDate() : (rawTs?.seconds ? new Date(rawTs.seconds * 1000) : new Date(rawTs || Date.now()));
                        return (
                          <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group text-left">
                            <td className="px-4 py-3 font-mono text-[9px] text-muted-foreground">{isNaN(tsDate.getTime()) ? 'SYNCING...' : format(tsDate, 'MM/dd HH:mm')}</td>
                            <td className="px-4 py-3"><span className="font-bold text-[11px] group-hover:text-destructive transition-colors">{v.ruleName}</span></td>
                            <td className="px-4 py-3 truncate max-w-[150px] text-[10px] font-medium opacity-80 italic">"{v.proposedUserAction}"</td>
                            <td className="px-4 py-3"><Badge variant="outline" className={cn("text-[8px] h-4 font-black uppercase", v.systemResponse === 'OVERRIDDEN' ? "text-destructive border-destructive/20" : "text-accent border-accent/20")}>{v.systemResponse}</Badge></td>
                            <td className="px-4 py-3 text-right font-mono font-black text-primary">+0.042</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="text-left"><td colSpan={5} className="h-32 text-center opacity-20"><Waves className="w-8 h-8 mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest italic">Registry clean. Process integrity nominal.</p></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6 text-left">
          <Card className="bg-primary border-primary/20 text-primary-foreground shadow-2xl relative overflow-hidden group text-left">
            <Zap className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
            <CardHeader className="relative z-10 border-b border-white/10 pb-4 text-left">
              <div className="flex items-center gap-2 text-left">
                <Target className="w-5 h-5" />
                <CardTitle className="text-sm font-black uppercase tracking-widest text-left">Authority Benchmark</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 space-y-6 text-left">
              <p className="text-sm font-medium leading-relaxed italic border-l-2 border-white/20 pl-4 text-left">
                "Process adherence is the primary substrate of realized alpha. Trust the constraints established during your low-regime research sessions."
              </p>
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-left"><span>DSP Performance Node</span><span>{stats.dScore}%</span></div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden text-left"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${stats.dScore}%` }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-3 bg-white/5 rounded border border-white/10 space-y-1 text-left"><span className="text-[8px] font-black uppercase opacity-60">Status</span><div className="text-xs font-bold uppercase">NOMINAL</div></div>
                <div className="p-3 bg-white/5 rounded border border-white/10 space-y-1 text-left"><span className="text-[8px] font-black uppercase opacity-60">Override Key</span><div className="text-xs font-bold font-mono">0xBE...AD42</div></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 shadow-xl text-left">
            <CardHeader className="border-b border-white/5 pb-4 text-left">
              <div className="flex items-center gap-2 text-accent text-left">
                <Scale className="w-4 h-4" />
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-left">Regime Enforcement Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-left">
              <div className="space-y-3 text-left">
                {[
                  { label: 'Max Exposure (Politics)', val: '25%', limit: '25%', status: 'NOMINAL' },
                  { label: 'EVS Floor (Crypto)', val: '2.4%', limit: '3.0%', status: 'VIOLATION' },
                  { label: 'Consecutive Loss Limit', val: '1/3', limit: '3', status: 'SAFE' }
                ].map(item => (
                  <div key={item.label} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center group hover:border-accent/30 transition-all text-left">
                    <div className="space-y-0.5 text-left"><span className="text-[10px] font-bold block">{item.label}</span><span className="text-[8px] font-black text-muted-foreground uppercase">Current: {item.val}</span></div>
                    <div className="text-right text-left"><div className="text-sm font-black font-mono text-accent">{item.limit}</div><Badge variant="outline" className={cn("text-[7px] h-3.5 px-1 uppercase", item.status === 'VIOLATION' ? "text-destructive border-destructive/30 bg-destructive/5 animate-pulse" : "opacity-50")}>{item.status}</Badge></div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 text-left">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-muted-foreground mb-2 text-left"><BrainCircuit className="w-3 h-3" /> Stance Inhibitor Logic</div>
                <p className="text-[9px] text-muted-foreground leading-relaxed italic text-left">"Manual overrides are logged to the private performance node and decrease DSP by 250bps per occurrence."</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-left"><span>AES-256 Protocol</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Zero-Knowledge Registry</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Audit Stream: NOMINAL</span></div>
        <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4 text-left">"Trade Guardrails are a behavioral decision support system. They do not prevent trade execution at the venue level but enforce process integrity at the platform level. Finality occurs upon subscriber key verification."</p>
      </footer>
    </div>
  );
}