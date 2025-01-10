import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { useSelector } from 'react-redux';
import { useGetPoliciesTerms } from './use-get-policies-terms.ts';

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
 * Custom hook to check if a specific policy is authorized for the user (holder).
 * @param policy Address of the policy.
 * @param holder Address of the holder (optional). If not provided, it will use the user's address from Redux.
 */
export const useIsPolicyAuthorized = (
  policy: Address,
  holder?: Address
): UseIsPolicyAuthorizedHook => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);
  // `fetching` indicates if we are currently checking for authorization
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  // Use the hook that fetches all authorized policies for the holder
  const {
    authorizedHolderPolicies,
    loading: loadingPolicies,
    error: errorPolicies,
    refetch: refetchPolicies,
  } = useGetPoliciesTerms(holder ?? userAddress);

  /**
   * Checks if the given policy exists in the holder's authorized policies.
   */
  const fetchAuthorization = useCallback(() => {
    setFetching(true);

    // Validate that policy and holder exist
    if (!policy || !(holder ?? userAddress)) {
      setIsAuthorized(false);
      setError({ message: 'Policy or holder address is missing.' });
      setFetching(false);
      return;
    }

    // If there's an error from the other hook, propagate it
    if (errorPolicies) {
      setIsAuthorized(false);
      setError(errorPolicies);
      setFetching(false);
      return;
    }

    // If no policies have been fetched yet, we cannot check
    if (!authorizedHolderPolicies) {
      setIsAuthorized(false);
      setError(null);
      setFetching(false);
      return;
    }

    try {
      // Check if the given policy is in the list
      // Assume that each element looks like { policy: string, terms: {...} }
      const isPolicyInList = authorizedHolderPolicies.some(
        (p: any) => p.policy.toLowerCase() === policy.toLowerCase()
      );

      setIsAuthorized(isPolicyInList);
      setError(null);
    } catch (err: any) {
      console.error('Error checking policy authorization:', err);
      setIsAuthorized(undefined);
      setError({
        message: err?.message || 'An error occurred while checking policy authorization.',
      });
    } finally {
      setFetching(false);
    }
  }, [policy, holder, userAddress, authorizedHolderPolicies, errorPolicies]);

  // Whenever authorizedHolderPolicies or errorPolicies change, verify again
  useEffect(() => {
    fetchAuthorization();
  }, [fetchAuthorization]);

  // Allows re-triggering the fetch
  const refetch = useCallback(() => {
    // Refetch policies from the contract
    refetchPolicies();
  }, [refetchPolicies]);

  return {
    isAuthorized,
    loading: loadingPolicies, // Indicates if we are still fetching the list of policies
    fetching, // Indicates if we are checking authorization in that list
    error,
    refetch,
  };
};
