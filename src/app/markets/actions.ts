'use server';

/**
 * @fileOverview Server actions for markets are being deprecated in favor of 
 * client-side SDK operations to resolve authentication metadata issues.
 */

export async function issueSignal() {
  return { success: false, message: "Deprecated. Use client-side AnalysisDialog." };
}
