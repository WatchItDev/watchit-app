import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import AccessAggAbi from '@src/config/abi/AccessAgg.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ActiveLicensesError, Policy, UseGetActiveLicensesHook } from '@src/hooks/protocol/types.ts';

export const useGetActiveLicenses = (
  recipient: Address, holder?: Address
): UseGetActiveLicensesHook => {
  const [activeLicenses, setActiveLicenses] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ActiveLicensesError | null>(null);

  const fetchHolderPolicies = useCallback(async () => {
    // Validate that holder exists
    if (!holder || !recipient) {
      setActiveLicenses([]);
      setLoading(false);
      setError({ message: 'Holder or recipient address is missing.' });
      return;
    }

    setLoading(true);

    try {
      // Call the contract method
      const licenses = (await publicClient.readContract({
        address: GLOBAL_CONSTANTS.ACCESS_AGG_ADDRESS,
        abi: AccessAggAbi.abi,
        functionName: 'getActiveLicenses',
        args: [recipient, holder],
      })) as Policy[];

      // Store the response in state
      setActiveLicenses(licenses);
      setError(null);
    } catch (err) {
      console.error('Error fetching active licenses:', err);
      setActiveLicenses([]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
