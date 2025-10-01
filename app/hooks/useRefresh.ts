import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

export interface UseRefreshOptions {
  onRefresh: () => Promise<void>;
  
  minRefreshTime?: number;
  
  cooldownTime?: number;
}

export interface UseRefreshReturn {
  refreshing: boolean;
  refresh: () => Promise<void>;
  lastRefreshTime: number | null;
  canRefresh: boolean;
}


export const useRefresh = ({
  onRefresh,
  minRefreshTime = 1000,
  cooldownTime = 2000,
}: UseRefreshOptions): UseRefreshReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null);

  
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canRefresh = useMemo(() => {
    if (refreshing) return false;
    if (lastRefreshTime == null) return true;
    return Date.now() - lastRefreshTime > cooldownTime;
  }, [refreshing, lastRefreshTime, cooldownTime]);

  const refresh = useCallback(async () => {
    
    const now = Date.now();
    const allowed =
      !refreshing && (lastRefreshTime == null || now - lastRefreshTime > cooldownTime);
    if (!allowed) return;

    setRefreshing(true);
    const start = now;

    try {
      await onRefresh();
    } catch (error) {
      console.error('Erro durante refresh:', error);
      throw error;
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minRefreshTime - elapsed);

      const finish = () => {
        setRefreshing(false);
        setLastRefreshTime(Date.now());
      };

      if (remaining > 0) {
        refreshTimeoutRef.current = setTimeout(finish, remaining);
      } else {
        finish();
      }
    }
  }, [onRefresh, refreshing, lastRefreshTime, cooldownTime, minRefreshTime]);

  
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, []);

  return { refreshing, refresh, lastRefreshTime, canRefresh };
};


export const useMultipleRefresh = (
  refreshFunctions: Array<{
    key: string;
    onRefresh: () => Promise<void>;
    options?: Partial<UseRefreshOptions>;
  }>,
) => {
  const [refreshStates, setRefreshStates] = useState<Record<string, boolean>>({});
  const [globalRefreshing, setGlobalRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setGlobalRefreshing(true);
    try {
      await Promise.all(
        refreshFunctions.map(async ({ key, onRefresh }) => {
          setRefreshStates((prev) => ({ ...prev, [key]: true }));
          try {
            await onRefresh();
          } finally {
            setRefreshStates((prev) => ({ ...prev, [key]: false }));
          }
        }),
      );
    } finally {
      setGlobalRefreshing(false);
    }
  }, [refreshFunctions]);

  const refreshSingle = useCallback(
    async (key: string) => {
      const rf = refreshFunctions.find((r) => r.key === key);
      if (!rf) return;
      setRefreshStates((prev) => ({ ...prev, [key]: true }));
      try {
        await rf.onRefresh();
      } finally {
        setRefreshStates((prev) => ({ ...prev, [key]: false }));
      }
    },
    [refreshFunctions],
  );

  const isRefreshing = useCallback((key: string) => !!refreshStates[key], [refreshStates]);

  return { refreshStates, globalRefreshing, refreshAll, refreshSingle, isRefreshing };
};


export const useAutoRefresh = (
  onRefresh: () => Promise<void>,
  interval = 30_000, 
  enabled = true,
) => {
  const [isActive, setIsActive] = useState(enabled);

  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastRefreshRef = useRef<number>(0);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; 
    }
  }, []);

  const startAutoRefresh = useCallback(() => {
    
    stopAutoRefresh();

    if (!isActive) return;

    intervalRef.current = setInterval(async () => {
      const now = Date.now();
      if (now - lastRefreshRef.current >= interval) {
        try {
          await onRefresh();
        } catch (error) {
          console.error('Erro no refresh automático:', error);
        } finally {
          lastRefreshRef.current = Date.now();
        }
      }
    }, interval);
  }, [isActive, interval, onRefresh, stopAutoRefresh]);

  const toggleAutoRefresh = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isActive && enabled) startAutoRefresh();
    else stopAutoRefresh();
    return stopAutoRefresh;
  }, [isActive, enabled, startAutoRefresh, stopAutoRefresh]);

  
  useEffect(() => {
    if (isActive && enabled) {
      startAutoRefresh();
      return stopAutoRefresh;
    }
  }, [interval]); 

  return { isActive, toggleAutoRefresh, startAutoRefresh, stopAutoRefresh };
};


export const useRefreshWithRetry = (
  onRefresh: () => Promise<void>,
  maxRetries = 3,
  retryDelay = 1000,
) => {
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        await onRefresh();
        setRetryCount(0);
        setRefreshing(false);
        return;
      } catch (err) {
        if (attempt > maxRetries) {
          setError(err instanceof Error ? err : new Error('Erro desconhecido'));
          setRefreshing(false);
          throw err;
        }
        setRetryCount(attempt);
        
        await new Promise((res) => setTimeout(res, retryDelay * attempt));
      }
    }
  }, [onRefresh, maxRetries, retryDelay]);

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return { refreshing, retryCount, error, refresh, reset, hasError: error !== null };
};
