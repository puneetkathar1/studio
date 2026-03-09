'use server';

/**
 * @fileOverview Flow for generating a fair probability envelope for a contract's market price.
 *
 * - buildFairProbabilityEnvelope - A function that generates the fair probability envelope.
 * - FairProbabilityEnvelopeInput - The input type for the buildFairProbabilityEnvelope function.
 * - FairProbabilityEnvelopeOutput - The return type for the buildFairProbabilityEnvelope function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FairProbabilityEnvelopeInputSchema = z.object({
  marketData: z
    .string()
    .describe('Real-time market data including price, volume, and liquidity.'),
  microstructureFeatures: z
    .string()
    .describe('Computed market microstructure features.'),
});
export type FairProbabilityEnvelopeInput = z.infer<
  typeof FairProbabilityEnvelopeInputSchema
>;

const FairProbabilityEnvelopeOutputSchema = z.object({
  lowerBound: z.number().describe('The lower bound of the fair probability range.'),
  upperBound: z.number().describe('The upper bound of the fair probability range.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the determined probability range.'),
});
export type FairProbabilityEnvelopeOutput = z.infer<
  typeof FairProbabilityEnvelopeOutputSchema
>;

export async function buildFairProbabilityEnvelope(
  input: FairProbabilityEnvelopeInput
): Promise<FairProbabilityEnvelopeOutput> {
  return buildFairProbabilityEnvelopeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fairProbabilityEnvelopePrompt',
  input: {schema: FairProbabilityEnvelopeInputSchema},
  output: {schema: FairProbabilityEnvelopeOutputSchema},
  prompt: `You are an expert in prediction market analysis. Given the market data and microstructure features, determine a fair probability envelope (range) for the contract's market price.

Market Data: {{{marketData}}}
Microstructure Features: {{{microstructureFeatures}}}

Reasoning: Explain the rationale for the determined lower and upper bounds.
Lower Bound: The lower bound of the fair probability range.
Upper Bound: The upper bound of the fair probability range.`,
});

const buildFairProbabilityEnvelopeFlow = ai.defineFlow(
  {
    name: 'buildFairProbabilityEnvelopeFlow',
    inputSchema: FairProbabilityEnvelopeInputSchema,
    outputSchema: FairProbabilityEnvelopeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
