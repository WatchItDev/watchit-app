import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import { UseHasAccessHook } from '@src/hooks/protocol/types.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';

/**
 * Custom hook to check if the user has access to a publication.
 * @param ownerAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useHasAccess = (ownerAddress?: Address): UseHasAccessHook => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address;
  const { isAuthenticated } = useAccountSession();
  const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);

  const fetchAccess = async () => {
    if (!userAddress || !ownerAddress) {
      setLoading(false);
      setFetching(false);

      throw new Error('User address or owner address is missing while verifying user access.');
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
    } catch (err: any) {
      console.error('Error checking access:', err);
      setHasAccess(false);
      notifyError(ERRORS.VERIFY_ACCESS_ERROR);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, [userAddress, ownerAddress]);

  if (!isAuthenticated()) {
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
    refetch: fetchAccess,
  };
};
