import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { showSuccess } from '@/features/notifications/state/notificationSlice';
import { handleCommandError } from '@/lib/tauri';
import type { NodeRuntimeStatus } from '../types';

export function useNodeRuntime() {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const [runtimes, setRuntimes] = useState<NodeRuntimeStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [installingVersion, setInstallingVersion] = useState<string | null>(
    null
  );

  const loadNodeStatus = useCallback(async () => {
    try {
      const status = await invoke<NodeRuntimeStatus[]>(
        'get_node_runtimes_status'
      );
      setRuntimes(status);
    } catch (error) {
      handleCommandError(dispatch, error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const installNode = useCallback(
    async (version: string) => {
      setInstallingVersion(version);
      try {
        await invoke('install_node_runtime', { version });
        dispatch(showSuccess(t('nodeInstalled', { version })));
        await loadNodeStatus();
      } catch (error) {
        handleCommandError(dispatch, error);
      } finally {
        setInstallingVersion(null);
      }
    },
    [dispatch, loadNodeStatus, t]
  );

  const uninstallNode = useCallback(
    async (version: string) => {
      try {
        await invoke('uninstall_node_runtime', { version });
        dispatch(showSuccess(t('nodeUninstalled', { version })));
        await loadNodeStatus();
      } catch (error) {
        handleCommandError(dispatch, error);
      }
    },
    [dispatch, loadNodeStatus, t]
  );

  useEffect(() => {
    loadNodeStatus();

    const handleFocus = () => {
      loadNodeStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadNodeStatus]);

  return {
    runtimes,
    isLoading,
    installingVersion,
    actions: {
      loadStatus: loadNodeStatus,
      install: installNode,
      uninstall: uninstallNode,
    },
  };
}
