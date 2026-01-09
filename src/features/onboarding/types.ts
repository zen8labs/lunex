import { Step } from 'react-joyride';

export type TourId = 'welcomeFlow' | 'agentActionFlow' | 'communityToolFlow';

export interface OnboardingState {
  isRunning: boolean;
  activeTour: TourId | null;
  stepIndex: number;
  runHistory: Record<TourId, boolean>;
}

export type TourSteps = Record<TourId, Step[]>;
