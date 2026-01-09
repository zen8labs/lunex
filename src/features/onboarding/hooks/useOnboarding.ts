import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // Will ensure this import works after updating store
import {
  startTour,
  stopTour,
  completeTour,
  resetOnboarding,
} from '../onboardingSlice';
import { TourId } from '../types';

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const { isRunning, activeTour, stepIndex, runHistory } = useSelector(
    (state: RootState) => state.onboarding
  );

  const start = (tourId: TourId) => dispatch(startTour(tourId));
  const stop = () => dispatch(stopTour());
  const markComplete = (tourId: TourId) => dispatch(completeTour(tourId));
  const reset = () => dispatch(resetOnboarding());

  return {
    isRunning,
    activeTour,
    stepIndex,
    runHistory,
    hasCompleted: (tourId: TourId) => runHistory[tourId],
    startTour: start,
    stopTour: stop,
    completeTour: markComplete,
    resetOnboarding: reset,
  };
};
