import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import { HasAccessError, UseHasAccessHook } from '@src/hooks/protocol/types.ts';

/**
 * Custom hook to check if the user has access to a publication.
 * @param ownerAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useHasAccess = (ownerAddress?: Address): UseHasAccessHook => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchAccess = useCallback(async () => {
    if (!userAddress || !ownerAddress) {
      setLoading(false);
      setFetching(false);
      setError({ message: 'User address or owner address is missing.' });
      return;
    }

    setFetching(true);
    try {
      const accessData: any = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS,
        abi: AccessAggAbi.abi,
        functionName: 'isAccessAllowed',
        args: [userAddress, ownerAddress],
      });

      const access = Boolean(accessData?.[0]);
      setHasAccess(access);
      setError(null);
    } catch (err: any) {
      console.error('Error checking access:', err);
      setHasAccess(undefined);
      setError({ message: err?.message || 'An error occurred' });
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [userAddress, ownerAddress]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  const refetch = useCallback(() => {
    fetchAccess();
  }, [fetchAccess]);

  if (!userAddress) {
    return {
      hasAccess: false,
      loading: false,
      fetching: false,
      error: null,
      refetch: () => {},
    };
  }

  return {
    hasAccess,
    loading,
    fetching,
    error,
    refetch,
  };
};
