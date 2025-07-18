// @src/hooks/use-stale-while-loading.ts
import { useEffect, useState } from 'react';
import { QueryResult, OperationVariables } from '@apollo/client';

export function useStaleWhileLoading<T>(
  query: QueryResult<T, OperationVariables>
) {
  const { data, loading, ...rest } = query;

  // 👉  guardamos la última data válida en un STATE
  const [staleData, setStaleData] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      setStaleData(data);           // ✅  dispara re‑render
    }
  }, [data]);

  const hasData       = staleData !== undefined;
  const isInitialLoad = loading && !hasData;
  const isRefetch     = loading &&  hasData;

  return {
    data: staleData,      // siempre la última data conocida
    loading,
    isInitialLoad,
    isRefetch,
    ...rest,              // error, refetch, etc.
  };
}
