import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState, TourId } from './types';

const initialState: OnboardingState = {
  isRunning: false,
  activeTour: null,
  stepIndex: 0,
  runHistory: {
    welcomeFlow: false,
    agentActionFlow: false,
    communityToolFlow: false,
  },
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    startTour: (state, action: PayloadAction<TourId>) => {
      state.activeTour = action.payload;
      state.isRunning = true;
      state.stepIndex = 0;
    },
    stopTour: (state) => {
      state.isRunning = false;
      state.activeTour = null;
      state.stepIndex = 0;
    },
    setStepIndex: (state, action: PayloadAction<number>) => {
      state.stepIndex = action.payload;
    },
    completeTour: (state, action: PayloadAction<TourId>) => {
      state.runHistory[action.payload] = true;
      state.isRunning = false;
      state.activeTour = null;
      state.stepIndex = 0;
    },
    resetOnboarding: (state) => {
      state.runHistory = initialState.runHistory;
      state.isRunning = false;
      state.activeTour = null;
      state.stepIndex = 0;
    },
  },
});

export const {
  startTour,
  stopTour,
  setStepIndex,
  completeTour,
  resetOnboarding,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
