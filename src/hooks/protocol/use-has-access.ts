import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import { UseHasAccessHook } from '@src/hooks/protocol/types.ts';
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';
import { UseHasAccessDefaultResponse } from '@src/hooks/protocol/DEFAULTS.tsx';
import {RootState} from "@redux/store.ts"

/**
 * Custom hook to check if the user has access to a publication.
 * @param ownerAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useHasAccess = (ownerAddress?: Address): UseHasAccessHook => {
  const sessionData = useSelector((state: RootState) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isFullyAuthenticated);
  const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    if (!userAddress || !ownerAddress) {
      setLoading(false);
      return UseHasAccessDefaultResponse;
    }

    setLoading(true);
    try {
      const accessData: any = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS,
        abi: AccessAggAbi.abi,
        functionName: 'isAccessAllowed',
        args: [userAddress, ownerAddress],
      });

      const access = Boolean(accessData?.[0]);
      setHasAccess(access);
    } catch (err: any) {
      console.error('Error checking access:', err);
      setHasAccess(false);
      notifyError(ERRORS.VERIFY_ACCESS_ERROR);
    } finally {
      setLoading(false);
    }
  }, [userAddress, ownerAddress]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  if (!isAuthenticated) {
    return UseHasAccessDefaultResponse;
  }

  return {
    hasAccess,
    loading,
    fetch: fetchAccess,
  };
};
