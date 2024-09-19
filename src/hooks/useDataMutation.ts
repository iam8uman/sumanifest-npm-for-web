import { useState } from 'react';

interface MutationOptions<T> {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useDataMutation<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (options: MutationOptions<T>, data?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(options.url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      options.onSuccess?.(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      options.onError?.(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}