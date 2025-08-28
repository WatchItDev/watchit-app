import { useEffect, useRef, useState } from 'react';
import { QueryResult, OperationVariables } from '@apollo/client';
import { useAuth } from '@src/hooks/use-auth.ts';

export function useStaleWhileLoading<T>(
  query: QueryResult<T, OperationVariables>,
) {
  const { session } = useAuth();
  const { data, loading, refetch, ...rest } = query;
  const xpBalance = session?.user?.xpBalance ?? 0;
  const [staleData, setStaleData] = useState<T | undefined>(undefined);
  const prevXpRef = useRef<number>(xpBalance);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      setStaleData(data);
    }
  }, [data]);

  useEffect(() => {
    if (prevXpRef.current !== xpBalance) {
      const t = setTimeout(refetch, 3000);
      prevXpRef.current = xpBalance;
      return () => clearTimeout(t);
    }
  }, [xpBalance, refetch]);

  const hasData = staleData !== undefined;
  const isInitialLoad = loading && !hasData;
  const isRefetch = loading && hasData;

  return {
    data: staleData,
    loading,
    isInitialLoad,
    isRefetch,
    ...rest,
  };
}
