'use server'

import { deriveMarketState } from '@/ai/flows/derive-market-state'
import { MarketStateInputSchema, type MarketStateOutput } from './schemas'

export async function runDeriveState(
  prevState: any,
  formData: FormData
): Promise<{
  message: string
  data?: MarketStateOutput
  error?: any
}> {
  const validatedFields = MarketStateInputSchema.safeParse({
    currentPriceProb: formData.get('currentPriceProb'),
    marketFeatures: formData.get('marketFeatures'),
    externalSignals: formData.get('externalSignals'),
  })

  if (!validatedFields.success) {
    return {
      message: 'Please check your inputs.',
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await deriveMarketState(validatedFields.data)
    return {
      message: 'Successfully derived market state.',
      data: result,
    }
  } catch (e: any) {
    return {
      message: 'An error occurred.',
      error: e.message || 'Failed to derive state.',
    }
  }
}
