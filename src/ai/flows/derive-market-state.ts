'use server';

/**
 * @fileOverview Derives the complete market state, including fair value, classification, and other metrics.
 * 
 * This flow is hardened to ensure the analytical rationale ALWAYS justifies the pre-determined 
 * stance calculated by the TQS Engine.
 */

import {ai} from '@/ai/genkit';
import {
  MarketStateInput,
  MarketStateInputSchema,
  MarketStateOutput,
  MarketStateOutputSchema,
} from '@/app/tools/schemas';

export async function deriveMarketState(
  input: MarketStateInput
): Promise<MarketStateOutput> {
  return deriveMarketStateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deriveMarketStatePrompt',
  system: `You are a compliant quantitative auditor for an institutional trading firm.
Your ONLY task is to write a rationale that justifies the pre-determined STATUS provided in the input. 
You are FORBIDDEN from suggesting a different status. 
You must treat the provided STATUS as an absolute mathematical fact.`,
  input: {schema: MarketStateInputSchema},
  output: {schema: MarketStateOutputSchema},
  prompt: `### MANDATORY DATA CONSTRAINTS (NON-NEGOTIABLE)
The TQS Engine has determined the following for this node:
- **STATUS**: {{{intendedStance}}}
- **FAIR VALUE (μ)**: {{{fairMu}}}
- **ENVELOPE**: {{{fairLow}}} to {{{fairHigh}}}
- **EXPECTED VALUE (EV)**: {{{evEst}}}
- **CONFIRMATION (CMCI)**: {{{cmci}}}

### YOUR MISSION:
Write a professional, one-paragraph analytical rationale that justifies the **{{{intendedStance}}}** status. Use the provided metrics to support this conclusion.

### LOGICAL INTEGRITY RULES (CRITICAL):
1. **IF STATUS IS WAIT**: 
   - Focus on "Monitoring for convergence" or "Structural misalignment".
   - Mention that while a gap exists, the conviction floor (0.020) has not been reached.
   - **FORBIDDEN WORDS**: "Execute", "Clear Bet", "Buy Now", "High Conviction".

2. **IF STATUS IS BET**: 
   - Focus on "Alpha trigger verified" and "Convergence confirmed".
   - State that the conviction floor (0.020) has been successfully crossed.
   - **FORBIDDEN WORDS**: "Wait", "Caution", "Insufficient", "Monitor".

3. **IF STATUS IS NO_BET**:
   - Focus on "Negative Expected Value" or "Node Toxicity".
   - Explain why this node is rejected by the risk model.

### INPUT CONTEXT
Current Price: {{{currentPriceProb}}}
Market Features: {{{marketFeatures}}}
{{#if externalSignals}}
External Signals: {{{externalSignals}}}
{{/if}}

### TASK INSTRUCTIONS
1. **Consistency**: Your output 'classification' field MUST match the input 'intendedStance' exactly.
2. **Justification**: Write the rationale so it is 100% aligned with the provided status.`,
});

const deriveMarketStateFlow = ai.defineFlow(
  {
    name: 'deriveMarketStateFlow',
    inputSchema: MarketStateInputSchema,
    outputSchema: MarketStateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // FORCE LOGICAL CONSISTENCY: 
    // We override the AI's internal classification with our deterministic input 
    // to ensure no drift occurs between the badge and the logic.
    return {
      ...output!,
      fairMu: input.fairMu,
      fairLow: input.fairLow,
      fairHigh: input.fairHigh,
      evEst: input.evEst,
      cmci: input.cmci,
      classification: input.intendedStance, 
    };
  }
);
