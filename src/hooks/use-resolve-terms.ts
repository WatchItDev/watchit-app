import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface Terms {
  amount: any;    // Amount in wei
  currency: string; // MMC address
  rateBasis: number;
  uri: string;
}

interface UseResolveTermsHook {
  terms?: Terms;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

type SubscriptionTerms = {
  amount: number,
  currency: string,
  rateBasis: number,
  uri: string
}

/**
 * Custom hook to resolve terms from a given holder address.
 * @param holderAddress The address of the publication owner (holder).
 * @returns An object with terms, loading state, error, and a refetch function.
 */
export const useResolveTerms = (holderAddress?: Address): UseResolveTermsHook => {
  const [terms, setTerms] = useState<Terms | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchTerms = useCallback(async () => {
    if (!holderAddress) {
      setLoading(false);
      setFetching(false);
      setError({ message: 'Holder address is missing.' });
      return;
    }

    try {
      setFetching(true);
      const data: SubscriptionTerms = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        abi: SubscriptionPolicyAbi.abi,
        functionName: 'resolveTerms',
        args: [holderAddress],
      }) as unknown as SubscriptionTerms;

      setTerms(data);
      setError(null);
    } catch (err: any) {
      console.error('Error resolving terms:', err);
      setTerms(undefined);
      setError({ message: err?.message || 'An error occurred' });
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [holderAddress]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const refetch = useCallback(() => {
    fetchTerms();
  }, [fetchTerms]);

  if (!holderAddress) {
    return {
      terms: {} as Terms,
      loading: false,
      fetching: false,
      error: null,
      refetch: () => { },
    };
  }

  return {
    terms,
    loading,
    fetching,
    error,
    refetch,
  };
};
