import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface ActiveLicensesError {
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

interface UseGetActiveLicensesHook {
  activeLicenses: any[];
  loading: boolean;
  error?: ActiveLicensesError | null;
  refetch: () => void;
}

export const useGetActiveLicenses = (
  recipient: Address, holder?: Address
): UseGetActiveLicensesHook => {
  const [activeLicenses, setActiveLicenses] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ActiveLicensesError | null>(null);

  const fetchHolderPolicies = useCallback(async () => {
    // Validate that holder exists
    if (!holder) {
      setActiveLicenses([]);
      setLoading(false);
      setError({ message: 'Holder address is missing.' });
      return;
    }

    setLoading(true);

    try {
      console.log('getActiveLicenses')
      console.log(GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS)
      // Call the contract method
      const licenses: any = (await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS,
        abi: AccessAggAbi.abi,
        functionName: 'getActiveLicenses',
        args: [recipient, holder],
      })) as Policy[];

      console.log('getActiveLicenses')
      console.log(licenses)
      console.log(GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS)

      // Store the response in state
      setActiveLicenses(licenses);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching active licenses:', err);
      setActiveLicenses([]);
      setError({ message: err?.message || 'Error occurred while fetching active licenses.' });
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
    activeLicenses,
    loading,
    error,
    refetch,
  };
};
