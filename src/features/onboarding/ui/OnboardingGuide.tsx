import React from 'react';
import Joyride, { CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { setStepIndex, stopTour, completeTour } from '../onboardingSlice';
import { ONBOARDING_STEPS } from '../config';

const OnboardingGuide: React.FC = () => {
  const dispatch = useDispatch();
  const { isRunning, activeTour, stepIndex } = useSelector(
    (state: RootState) => state.onboarding
  );

  // Define theme colors using CSS variables
  // Note: Joyride accepts inline styles object, so we use var() to hook into existing theme system
  const joyrideStyles = {
    options: {
      zIndex: 10000,
      primaryColor: '#8b5cf6', // A purple accent fallback
      textColor: '#e5e7eb', // Text color fallback (dark mode friendly)
      backgroundColor: '#1f2937', // Background fallback
      arrowColor: '#1f2937',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
    },
    tooltip: {
      borderRadius: '12px',
      fontFamily: 'inherit',
      backgroundColor: 'var(--color-bg-secondary, #1f2937)',
      color: 'var(--color-text-primary, #ffffff)',
      border: '1px solid var(--color-border-primary, #374151)',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    buttonNext: {
      backgroundColor: 'var(--color-primary-600, #7c3aed)',
      color: '#fff',
      borderRadius: '6px',
      outline: 'none',
      fontWeight: 500,
    },
    buttonBack: {
      color: 'var(--color-text-secondary, #9ca3af)',
      marginRight: '10px',
    },
    buttonSkip: {
      color: 'var(--color-text-tertiary, #6b7280)',
    },
    beacon: {
      // Customize beacon if needed
    },
  };

  if (!activeTour) return null;

  const steps = ONBOARDING_STEPS[activeTour] || [];

  const handleCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    // Controlled wrapper to sync state with Redux
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Handle next/prev
      const newIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (action === ACTIONS.NEXT || action === ACTIONS.PREV) {
        dispatch(setStepIndex(newIndex));
      }
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      dispatch(completeTour(activeTour));
    } else if (action === ACTIONS.CLOSE) {
      dispatch(stopTour());
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      styles={joyrideStyles}
      floaterProps={{
        disableAnimation: true, // Sometimes helps with positioning
      }}
      locale={{
        back: 'Quay lại',
        close: 'Đóng',
        last: 'Hoàn tất',
        next: 'Tiếp tục',
        skip: 'Bỏ qua',
      }}
    />
  );
};

export default OnboardingGuide;
