import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { showSuccess } from '@/features/notifications/state/notificationSlice';
import { handleCommandError } from '@/lib/tauri';
import type { PythonRuntimeStatus } from '../types';

export function usePythonRuntime() {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const [runtimes, setRuntimes] = useState<PythonRuntimeStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [installingVersion, setInstallingVersion] = useState<string | null>(
    null
  );

  const loadPythonStatus = useCallback(async () => {
    try {
      const status = await invoke<PythonRuntimeStatus[]>(
        'get_python_runtimes_status'
      );
      setRuntimes(status);
    } catch (error) {
      handleCommandError(dispatch, error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const installPython = useCallback(
    async (version: string) => {
      setInstallingVersion(version);
      try {
        await invoke('install_python_runtime', { version });
        dispatch(showSuccess(t('pythonInstalled', { version })));
        await loadPythonStatus();
      } catch (error) {
        handleCommandError(dispatch, error);
      } finally {
        setInstallingVersion(null);
      }
    },
    [dispatch, loadPythonStatus, t]
  );

  const uninstallPython = useCallback(
    async (version: string) => {
      try {
        await invoke('uninstall_python_runtime', { version });
        dispatch(showSuccess(t('pythonUninstalled', { version })));
        await loadPythonStatus();
      } catch (error) {
        handleCommandError(dispatch, error);
      }
    },
    [dispatch, loadPythonStatus, t]
  );

  const installPythonPackages = useCallback(
    async (packages: string[]) => {
      try {
        await invoke('install_python_packages', {
          packages,
          version: null, // Use default/latest installed Python runtime
        });
        dispatch(
          showSuccess(
            t('pythonPackagesInstalled', {
              packages: packages.join(', '),
            })
          )
        );
      } catch (error) {
        handleCommandError(dispatch, error);
        throw error;
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    loadPythonStatus();

    const handleFocus = () => {
      loadPythonStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadPythonStatus]);

  return {
    runtimes,
    isLoading,
    installingVersion,
    actions: {
      loadStatus: loadPythonStatus,
      install: installPython,
      uninstall: uninstallPython,
      installPackages: installPythonPackages,
    },
  };
}
