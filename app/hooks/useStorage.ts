import { useState, useEffect, useCallback } from 'react';
import storageService, { StorageOptions, STORAGE_KEYS } from '../services/storageService';

export interface UseStorageReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setData: (value: T, options?: StorageOptions) => Promise<boolean>;
  removeData: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useStorage = <T>(
  key: string,
  defaultValue: T | null = null,
  secure: boolean = false
): UseStorageReturn<T> => {
  const [data, setDataState] = useState<T | null>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storedData = await storageService.getItem<T>(key, secure);
      setDataState(storedData ?? defaultValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      setDataState(defaultValue);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, secure]);

  
  const setData = useCallback(async (value: T, options?: StorageOptions): Promise<boolean> => {
    try {
      setError(null);
      const success = await storageService.setItem(key, value, options);
      if (success) {
        setDataState(value);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados');
      return false;
    }
  }, [key]);

  
  const removeData = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const success = await storageService.removeItem(key, secure);
      if (success) {
        setDataState(defaultValue);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover dados');
      return false;
    }
  }, [key, defaultValue, secure]);

  
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    setData,
    removeData,
    refresh,
  };
};


export const useUserData = () => {
  return useStorage(STORAGE_KEYS.USER_DATA, null, true);
};


export const useAuthToken = () => {
  return useStorage(STORAGE_KEYS.USER_TOKEN, null, true);
};


export const useThemePreference = () => {
  return useStorage<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME_MODE, 'system');
};


export const useNotificationSettings = () => {
  return useStorage(STORAGE_KEYS.NOTIFICATIONS_ENABLED, true);
};


export const useMotosCache = () => {
  return useStorage(STORAGE_KEYS.MOTOS_CACHE, [], false);
};


export const useSearchHistory = () => {
  return useStorage<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
};


export const useFilterPreferences = () => {
  return useStorage(STORAGE_KEYS.FILTER_PREFERENCES, {
    status: [],
    filial: [],
    modelo: [],
    sortBy: 'placa',
    sortOrder: 'asc',
  });
};


export const useMultipleStorage = <T extends Record<string, any>>(
  keys: Array<keyof T>,
  secure: boolean = false
) => {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await storageService.getMultiple(keys as string[], secure);
      setData(results as Partial<T>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [keys, secure]);

  const setMultipleData = useCallback(async (newData: Partial<T>): Promise<boolean> => {
    try {
      setError(null);
      const items = Object.entries(newData).map(([key, value]) => [key, value] as [string, any]);
      const success = await storageService.setMultiple(items);
      if (success) {
        setData(prev => ({ ...prev, ...newData }));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados');
      return false;
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    data,
    loading,
    error,
    setMultipleData,
    refresh: loadAllData,
  };
};


export const useStorageInfo = () => {
  const [info, setInfo] = useState({
    totalKeys: 0,
    cacheSize: 0,
    estimatedSize: '0 B',
  });
  const [loading, setLoading] = useState(true);

  const loadInfo = useCallback(async () => {
    try {
      setLoading(true);
      const storageInfo = await storageService.getStorageInfo();
      setInfo(storageInfo);
    } catch (error) {
      console.error('Erro ao carregar informações do storage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cleanExpiredData = useCallback(async () => {
    await storageService.cleanExpiredData();
    await loadInfo(); 
  }, [loadInfo]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return {
    info,
    loading,
    refresh: loadInfo,
    cleanExpiredData,
  };
};

