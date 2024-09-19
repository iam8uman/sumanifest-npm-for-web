import { useState, useEffect, useCallback, useRef } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheItem<any>> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDataFetch<T = any>(url: string, options: FetchOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const optionsRef = useRef(options);
  const cancelRequest = useRef<boolean>(false);

  const fetchData = useCallback(async (url: string, options: FetchOptions) => {
    setState(prev => ({ ...prev, isLoading: true }));

    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cachedItem = cache.get(cacheKey);

    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      setState({
        data: cachedItem.data,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (cancelRequest.current) return;

      setState({
        data,
        isLoading: false,
        error: null,
      });

      cache.set(cacheKey, { data, timestamp: Date.now() });
    } catch (error) {
      if (cancelRequest.current) return;

      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
      });
    }
  }, []);

  useEffect(() => {
    if (!url) return;

    cancelRequest.current = false;
    void fetchData(url, optionsRef.current);

    return () => {
      cancelRequest.current = true;
    };
  }, [url, fetchData]);

  const refetch = useCallback(() => {
    void fetchData(url, optionsRef.current);
  }, [url, fetchData]);

  const updateOptions = useCallback((newOptions: Partial<FetchOptions>) => {
    optionsRef.current = { ...optionsRef.current, ...newOptions };
    refetch();
  }, [refetch]);

  return { ...state, refetch, updateOptions };
}