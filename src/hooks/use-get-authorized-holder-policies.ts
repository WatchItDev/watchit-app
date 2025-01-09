import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import PoliciesAggAbi from '@src/config/abi/PoliciesAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface PolicyTerms {
  amount: string;
  currency: string;
  rateBasis: number;
  uri: string;
}

interface Policy {
  policy: string;
  terms: PolicyTerms;
}

interface UseGetAuthorizedHolderPoliciesHook {
  authorizedHolderPolicies: Policy[];
  loading: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

/**
 * Custom hook that fetches the authorized policies for a given holder.
 * @param holder Address of the holder.
 */
export const useGetAuthorizedHolderPolicies = (
  holder: Address | undefined
): UseGetAuthorizedHolderPoliciesHook => {
  const [authorizedHolderPolicies, setAuthorizedHolderPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchHolderPolicies = useCallback(async () => {
    // Validate that holder exists
    if (!holder) {
      setAuthorizedHolderPolicies([]);
      setLoading(false);
      setError({ message: 'Holder address is missing.' });
      return;
    }

    setLoading(true);

    try {
      // Call the contract method
      const policies: any = (await publicClient.readContract({
        address: GLOBAL_CONSTANTS.POLICIES_AGG_ADDRESS,
        abi: PoliciesAggAbi.abi,
        functionName: 'getPoliciesTerms',
        args: [holder],
      })) as Policy[];

      // Store the response in state
      setAuthorizedHolderPolicies(policies);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching holder-wide policies:', err);
      setAuthorizedHolderPolicies([]);
      setError({ message: err?.message || 'Error occurred while fetching authorized policies.' });
    } finally {
      setLoading(false);
    }
  }, [holder]);

  useEffect(() => {
    fetchHolderPolicies();
  }, [fetchHolderPolicies]);

  // Allows to refetch the data on demand
  const refetch = useCallback(() => {
    fetchHolderPolicies();
  }, [fetchHolderPolicies]);

  return {
    authorizedHolderPolicies,
    loading,
    error,
    refetch,
  };
};
