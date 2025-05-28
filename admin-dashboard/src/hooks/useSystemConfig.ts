import { useState, useEffect } from 'react';
import {
  getSystemConfig,
  updateSystemConfig,
  SystemConfig,
  SystemConfigUpdate
} from '@/services/systemService';

export const useSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSystemConfig();
      setConfig(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system config');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (updates: SystemConfigUpdate) => {
    setIsSaving(true);
    setError(null);
    try {
      const updatedConfig = await updateSystemConfig(updates);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update system config');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    isSaving,
    fetchConfig,
    saveConfig
  };
};