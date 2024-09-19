import { useState, useEffect, useCallback } from 'react';
import { useDataFetch } from './useDataFetch';

export function usePolling<T>(url: string, interval = 5000) {
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data, isLoading, error, refetch } = useDataFetch<T>(url);

  const startPolling = useCallback(() => setShouldPoll(true), []);
  const stopPolling = useCallback(() => setShouldPoll(false), []);

  useEffect(() => {
    if (!shouldPoll) return;

    const pollInterval = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(pollInterval);
  }, [shouldPoll, interval, refetch]);

  return { data, isLoading, error, startPolling, stopPolling };
}