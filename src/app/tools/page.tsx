'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { runDeriveState } from './actions'
import { deriveStateSchema } from './schemas'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bot } from 'lucide-react'
import type { z } from 'zod'

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Generating...' : children}
    </Button>
  )
}

function DeriveStateForm() {
  const [state, formAction] = useActionState(runDeriveState, { message: '' })

  type FormErrors = z.inferFormattedError<typeof deriveStateSchema>
  const errors =
    state.error && typeof state.error === 'object'
      ? (state.error as FormErrors)
      : undefined

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">
            Market State Derivation Tool
          </CardTitle>
          <CardDescription>
            Input market data to generate a complete market state analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPriceProb">Current Price Probability</Label>
              <Input
                id="currentPriceProb"
                name="currentPriceProb"
                type="number"
                step="0.01"
                placeholder="0.42"
              />
              {errors?.currentPriceProb && (
                <p className="text-sm text-destructive">
                  {errors.currentPriceProb._errors.join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketFeatures">Market Features (JSON)</Label>
            <Textarea
              id="marketFeatures"
              name="marketFeatures"
              placeholder='e.g., {"sps": 0.5, "cci": 0.2, "vol": 0.1, ...}'
              rows={5}
            />
            {errors?.marketFeatures && (
              <p className="text-sm text-destructive">
                {errors.marketFeatures._errors.join(', ')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="externalSignals">External Signals (JSON, Optional)</Label>
            <Textarea
              id="externalSignals"
              name="externalSignals"
              placeholder='e.g., [{"signalName": "US_CPI_YOY", "value": 3.4, ...}]'
              rows={5}
            />
            {errors?.externalSignals && (
              <p className="text-sm text-destructive">
                {errors.externalSignals._errors.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-destructive">
            {!state.data && state.message}
          </p>
          <SubmitButton>Derive Market State</SubmitButton>
        </CardFooter>
      </form>
      {state.data && (
        <CardContent className="border-t pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold font-headline">
                Derived Market State
              </h3>
            </div>
            <div className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between items-center col-span-full">
                    <span className="text-muted-foreground">Classification</span>
                     <Badge
                        variant={
                        state.data.classification === 'BET'
                            ? 'default'
                            : state.data.classification === 'NO_BET'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-lg"
                    >
                        {state.data.classification}
                    </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block">Fair Value</span>
                  <span className="font-bold text-primary">
                    ${state.data.fairLow.toFixed(3)} - ${state.data.fairHigh.toFixed(3)}
                  </span>
                </div>
                 <div>
                  <span className="text-muted-foreground block">μ / σ</span>
                  <span className="font-mono">
                    {state.data.fairMu.toFixed(3)} / {state.data.fairSigma.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Est. Value (EV)</span>
                  <span className="font-mono">{state.data.evEst.toFixed(3)}</span>
                </div>
                 <div>
                  <span className="text-muted-foreground block">CMCI</span>
                  <span className="font-mono">{state.data.cmci.toFixed(3)}</span>
                </div>
                 <div className="col-span-full">
                  <span className="text-muted-foreground block">Tags</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {state.data.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 mt-2">Rationale</h4>
                <p className="text-sm text-muted-foreground">
                  {state.data.rationale}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}


export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">AI-Powered Tools</h1>
        <p className="text-muted-foreground">
          Leverage GenAI to analyze markets and generate trading signals.
        </p>
      </div>
      <DeriveStateForm />
    </div>
  )
}
