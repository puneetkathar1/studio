'use client';

import { OnboardingTour } from '@/components/layout/OnboardingTour';
import { ProOnboardingTour } from '@/components/layout/ProOnboardingTour';
import { LiveTickSimulator } from '@/components/intelligence/LiveTickSimulator';
import { WhaleTrackerSimulator } from '@/components/intelligence/WhaleTrackerSimulator';
import { TqsAlertListener } from '@/components/intelligence/TqsAlertListener';

/**
 * @fileOverview Consolidates all background client-side logic.
 * This reduces chunk complexity in the root layout and ensures consistent hydration.
 */
export function ClientSideLogic() {
  return (
    <>
      <OnboardingTour />
      <ProOnboardingTour />
      <LiveTickSimulator />
      <WhaleTrackerSimulator />
      <TqsAlertListener />
    </>
  );
}
