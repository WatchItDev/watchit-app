import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import RightsPolicyAuthorizerAbi from '@src/config/abi/RightsPolicyAuthorizer.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// LENS IMPORTS
import { ProfileSession, useSession } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import {useSelector} from "react-redux";

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface UseIsPolicyAuthorizedHook {
  isAuthorized?: boolean;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

/**
 * Custom hook to check if a user has a policy authorized.
 * @param policy The address of the policy.
 * @param holder The address of the holder. If not provided, it uses the current logged-in profile's address.
 */
export const useIsPolicyAuthorized = (
  policy: Address,
  holder?: Address
): UseIsPolicyAuthorizedHook => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchAuthorization = useCallback(async () => {
    if (!policy || !(holder ?? userAddress)) {
      setLoading(false);
      setFetching(false);
      setError({ message: 'Policy or holder address is missing.' });
      return;
    }

    setFetching(true);

    try {
      const authorizedData = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.RIGHT_POLICY_AUTHORIZER,
        abi: RightsPolicyAuthorizerAbi.abi,
        functionName: 'isPolicyAuthorized',
        args: [policy, holder ?? userAddress],
      });

      const authorized = Boolean(authorizedData);
      setIsAuthorized(authorized);
      setError(null);
    } catch (err: any) {
      console.error('Error checking policy authorization:', err);
      setIsAuthorized(undefined);
      setError({ message: err?.message || 'An error occurred' });
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [policy, holder, userAddress]);

  useEffect(() => {
    fetchAuthorization();
  }, [fetchAuthorization]);

  const refetch = useCallback(() => {
    fetchAuthorization();
  }, [fetchAuthorization]);

  return {
    isAuthorized,
    loading,
    fetching,
    error,
    refetch,
  };
};
