import { useState, useEffect, useCallback } from 'react';
import { useDataFetch } from './useDataFetch';

export function useInfiniteScroll<T>(baseUrl: string, pageSize = 10) {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);

  const url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;
  const { data, isLoading, error } = useDataFetch<T[]>(url);

  useEffect(() => {
    if (data) {
      setAllData(prev => [...prev, ...data]);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!isLoading && !error) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, error]);

  return { data: allData, isLoading, error, loadMore };
}