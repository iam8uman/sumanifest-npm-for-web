import { useState } from 'react';
import { useDataFetch } from './useDataFetch';

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePaginatedFetch<T>(
  baseUrl: string,
  options: PaginationOptions = {}
) {
  const [page, setPage] = useState(options.initialPage || 1);
  const pageSize = options.pageSize || 10;

  const url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;
  const { data, isLoading, error, refetch } = useDataFetch<T>(url);

  const goToNextPage = () => setPage(prev => prev + 1);
  const goToPreviousPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (pageNumber: number) => setPage(pageNumber);

  return {
    data,
    isLoading,
    error,
    refetch,
    page,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
}