import { useState, useCallback } from 'react';

export type SettingsViewId = 'root' | string;

export interface SettingsView {
  id: SettingsViewId;
  title: string;
}

export function useSettingsNav(initialView: SettingsView) {
  const [stack, setStack] = useState<SettingsView[]>([initialView]);

  const currentView = stack[stack.length - 1];

  const push = useCallback((view: SettingsView) => {
    setStack((prev) => [...prev, view]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback((view: SettingsView) => {
    setStack([view]);
  }, []);

  return {
    currentView,
    push,
    pop,
    reset,
    canGoBack: stack.length > 1,
  };
}
