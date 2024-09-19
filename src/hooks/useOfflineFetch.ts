import { useState, useEffect } from 'react';
import * as localforage from 'localforage';
import { useDataFetch } from './useDataFetch'; // Assuming useDataFetch is defined elsewhere

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  // other properties...
}

function convertRequestInitToFetchOptions(options?: RequestInit): FetchOptions | undefined {
  if (!options) return undefined;
  const headers: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  return {
    method: options.method as HttpMethod,
    headers,
    body: options.body,
    // other properties...
  };
}

export function useOfflineFetch<T>(url: string, options?: RequestInit) {
  const fetchOptions = convertRequestInitToFetchOptions(options);
  const { data, isLoading, error, refetch } = useDataFetch<T>(url, fetchOptions);
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (data) {
      localforage.setItem(url, data);
    }
  }, [url, data]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setIsOffline(true);
      localforage.getItem<T>(url).then((cachedData) => {
        if (cachedData) {
          setCachedData(cachedData);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [url]);

  return { data: isOffline ? cachedData : data, isLoading, error, refetch };
}