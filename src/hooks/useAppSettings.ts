import { useAppSelector, useAppDispatch } from '@/app/hooks';
import {
  setLanguage,
  setUserMode,
  setTheme,
  loadAppSettings,
} from '@/features/ui/state/uiSlice';

type Theme =
  | 'light'
  | 'dark'
  | 'system'
  | 'github-light'
  | 'github-dark'
  | 'gruvbox'
  | 'dracula'
  | 'solarized-light'
  | 'solarized-dark'
  | 'one-dark-pro'
  | 'one-light'
  | 'monokai'
  | 'nord'
  | 'ayu-dark';

/**
 * Hook to access and manage app settings (language, userMode, and theme)
 */
export function useAppSettings() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const userMode = useAppSelector((state) => state.ui.userMode);
  const theme = useAppSelector((state) => state.ui.theme);
  const loading = useAppSelector((state) => state.ui.loading);

  const updateLanguage = (lang: 'vi' | 'en') => {
    dispatch(setLanguage(lang));
  };

  const updateUserMode = (mode: 'normal' | 'developer') => {
    dispatch(setUserMode(mode));
  };

  const updateTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  const reloadSettings = () => {
    dispatch(loadAppSettings());
  };

  return {
    language,
    userMode,
    theme,
    loading,
    updateLanguage,
    updateUserMode,
    updateTheme,
    reloadSettings,
  };
}
