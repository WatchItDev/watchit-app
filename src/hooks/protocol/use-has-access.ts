// REACT IMPORTS
import { useState, useEffect, useCallback } from 'react';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { UseHasAccessHook } from '@src/hooks/protocol/types.ts';
import { notifyError } from '@src/libs/notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { UseHasAccessDefaultResponse } from '@src/hooks/protocol/DEFAULTS.tsx';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

/**
 * Custom hook to check if the user has access to a publication.
 * @param ownerAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useHasAccess = (ownerAddress?: Address): UseHasAccessHook => {
  const { session: sessionData, isFullyAuthenticated: isAuthenticated } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const userAddress = sessionData?.profile?.ownedBy?.address;

  const fetchAccess = useCallback(async () => {
    if (!userAddress || !ownerAddress) {
      setLoading(false);
      return UseHasAccessDefaultResponse;
    }

    setLoading(true);
    try {
      const accessData = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS,
        abi: AccessAggAbi.abi,
        functionName: 'isAccessAllowed',
        args: [userAddress, ownerAddress],
      }) as readonly [boolean, number];

      const access = Boolean(accessData?.[0]);
      setHasAccess(access);
    } catch (err) {
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
