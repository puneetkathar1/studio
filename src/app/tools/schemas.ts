import { z } from 'zod';

export const MarketStateInputSchema = z.object({
  currentPriceProb: z.coerce
    .number()
    .min(0, 'Must be at least 0')
    .max(1, 'Must be at most 1')
    .describe('The current market price probability (0-1).'),
  intendedStance: z
    .enum(['BET', 'NO_BET', 'WAIT'])
    .describe('The pre-determined stance calculated by the TQS engine.'),
  fairMu: z.number().describe('The calculated fair value mean.'),
  fairLow: z.number().describe('The calculated lower bound of the envelope.'),
  fairHigh: z.number().describe('The calculated upper bound of the envelope.'),
  evEst: z.number().describe('The calculated expected value delta.'),
  cmci: z.number().describe('The calculated confirmation score.'),
  marketFeatures: z
    .string()
    .min(10, 'Please provide detailed market features as a JSON string.')
    .describe(
      'JSON string of computed market features like SPS, CCI, volatility, momentum, and liquidity.'
    ),
  externalSignals: z
    .string()
    .optional()
    .describe(
      'JSON string of relevant external signals (e.g., news, macro data).'
    ),
});
export type MarketStateInput = z.infer<typeof MarketStateInputSchema>;

export const MarketStateOutputSchema = z.object({
  fairMu: z
    .number()
    .describe('The mean of the fair value probability distribution.'),
  fairSigma: z
    .number()
    .describe(
      'The standard deviation of the fair value probability distribution.'
    ),
  fairLow: z
    .number()
    .describe(
      'The lower bound of the fair probability envelope (e.g., mu - 1.5 * sigma).'
    ),
  fairHigh: z
    .number()
    .describe(
      'The upper bound of the fair probability envelope (e.g., mu + 1.5 * sigma).'
    ),
  cmci: z
    .number()
    .describe(
      'Confirmation score (0-1) based on how well external signals confirm market features.'
    ),
  evEst: z
    .number()
    .describe(
      'Estimated value of a trade based on the gap between current price and fair value.'
    ),
  classification: z
    .enum(['BET', 'NO_BET', 'WAIT'])
    .describe('The final classification signal.'),
  tags: z
    .array(z.string())
    .describe(
      'A list of relevant tags for this market state (e.g., "High Volatility", "Confirmed Trend").'
    ),
  rationale: z
    .string()
    .describe('A brief rationale for the derived state and classification.'),
});
export type MarketStateOutput = z.infer<typeof MarketStateOutputSchema>;

export const deriveStateSchema = MarketStateInputSchema;
