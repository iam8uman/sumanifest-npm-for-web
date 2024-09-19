import { useState, useEffect } from 'react';

export function useCancellableFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(url, { signal })
      .then(response => response.json())
      .then(json => {
        if (!signal.aborted) {
          setData(json);
          setIsLoading(false);
        }
      })
      .catch(e => {
        if (!signal.aborted) {
          setError(e instanceof Error ? e : new Error('An unknown error occurred'));
          setIsLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, isLoading, error };
}