'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'
import { doc, serverTimestamp } from 'firebase/firestore'
import { LogIn, UserPlus, RefreshCcw, Key, Mail, Zap, ShieldCheck, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid node identifier (Email).' }),
  password: z
    .string()
    .min(6, { message: 'Access key must be at least 6 characters.' }),
})

const recoverySchema = z.object({
  email: z.string().email({ message: 'Invalid node identifier (Email).' }),
})

type LoginFormValue = z.infer<typeof loginSchema>
type RecoveryFormValue = z.infer<typeof recoverySchema>

function AuthTerminal() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const auth = useAuth()
  const firestore = useFirestore()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const requestedTab = searchParams.get('tab') || 'login'

  const loginForm = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const recoveryForm = useForm<RecoveryFormValue>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: '' },
  })

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirect || '/terminal')
    }
  }, [user, isUserLoading, router, redirect])

  const onLogin = async (data: LoginFormValue) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      toast({
        title: 'Authentication Successful',
        description: "Node link established. Welcome back to the matrix.",
      })
      router.push(redirect || '/terminal')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignup = async (data: LoginFormValue) => {
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const newUser = userCredential.user

      const userDocRef = doc(firestore, 'users', newUser.uid)
      const userData = {
        id: newUser.uid,
        email: newUser.email,
        role: 'user',
        plan: 'pro', // Elevated to Pro by default for user testing
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      setDocumentNonBlocking(userDocRef, userData, {})

      toast({
        title: 'Node Initialized',
        description: "New access node created with PRO institutional protocol.",
      })
      router.push(redirect || '/terminal')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onRecover = async (data: RecoveryFormValue) => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, data.email)
      toast({
        title: 'Recovery Link Transmitted',
        description: "Instructions for access key reset sent to your node identifier.",
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Recovery Failed',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12 animate-in fade-in duration-1000">
      <div className="w-full max-w-[450px] space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-2xl shadow-primary/20">P</div>
          </div>
          <h1 className="text-3xl font-black font-headline tracking-tighter uppercase italic">Predictive<span className="text-primary">Insights</span></h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Access the Global Intelligence Matrix</p>
        </div>

        <Tabs defaultValue={requestedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 border border-white/5 h-12 p-1">
            <TabsTrigger value="login" className="text-[9px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-background">
              <LogIn className="w-3 h-3" /> Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-[9px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-background">
              <UserPlus className="w-3 h-3" /> Initialize
            </TabsTrigger>
            <TabsTrigger value="recovery" className="text-[9px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-background">
              <RefreshCcw className="w-3 h-3" /> Recovery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter">Key Verification</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Authorize your existing session node.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Node Identifier (Email)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="node@protocol.com" {...field} className="bg-background/50 font-mono text-xs h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Key className="w-3 h-3" /> Access Key
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50 font-mono text-xs h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={isLoading} className="w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20" type="submit">
                      {isLoading ? 'ESTABLISHING LINK...' : 'AUTHENTICATE ACCESS KEY'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-accent/30 bg-accent/5 backdrop-blur-xl shadow-2xl">
              <CardHeader className="pb-4 border-b border-accent/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter text-accent">Node Initialization</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-accent/60">Initialize new pro-tier access node.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/60">Primary Node ID (Email)</FormLabel>
                          <FormControl>
                            <Input placeholder="node@protocol.com" {...field} className="bg-background/50 font-mono text-xs h-11 border-accent/20 focus-visible:ring-accent" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/60">New Access Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50 font-mono text-xs h-11 border-accent/20 focus-visible:ring-accent" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="p-3 bg-accent/10 rounded border border-accent/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Prototype Bonus: PRO Access Active</span>
                      </div>
                      <p className="text-[8px] text-accent/70 leading-relaxed font-bold">New nodes are automatically provisioned with the high-conviction Institutional Protocol during this testing phase.</p>
                    </div>
                    <Button disabled={isLoading} variant="default" className="w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" type="submit">
                      {isLoading ? 'INITIALIZING NODE...' : 'CREATE ACCESS NODE'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recovery" className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded border border-white/10 text-muted-foreground">
                    <RefreshCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter">Key Recovery</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Transmit access key reset protocol.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...recoveryForm}>
                  <form onSubmit={recoveryForm.handleSubmit(onRecover)} className="space-y-6">
                    <FormField
                      control={recoveryForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Registered Node ID
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="node@protocol.com" {...field} className="bg-background/50 font-mono text-xs h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                      "Upon verification of your node identifier, a restoration link will be transmitted to reset your institutional access key via the secure Firebase gateway."
                    </p>
                    <Button disabled={isLoading} variant="outline" className="w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] border-white/10 hover:bg-white/5" type="submit">
                      {isLoading ? 'TRANSMITTING...' : 'INITIATE RECOVERY PROTOCOL'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="pt-8 border-t border-dashed border-white/10 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.3em]">
            <span>AES-256 GCM</span>
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span>RSA-4096</span>
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span>Optic Sync</span>
          </div>
          <p className="text-[8px] text-center max-w-[300px] leading-relaxed italic">
            "Your institutional node identity is verified against the decentralized oracle quorum. Access keys are hashed and never stored in plain text."
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Initializing Terminal...</p>
      </div>
    }>
      <AuthTerminal />
    </Suspense>
  )
}
