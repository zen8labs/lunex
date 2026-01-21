import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { logger } from '@/lib/logger';
import type { AddonConfig } from '../types';

export function useAddonConfig() {
  const [config, setConfig] = useState<AddonConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAddonConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await invoke<AddonConfig>('get_addon_config');
      setConfig(result);
    } catch (error) {
      logger.error('Failed to load addon config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddonConfig();
  }, [loadAddonConfig]);

  return {
    config,
    isLoading,
    loadAddonConfig,
  };
}
