import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { useGetPoliciesTerms } from './use-get-policies-terms.ts';
import { HasAccessError, UseGetPolicyTermsHook, Terms } from '@src/hooks/protocol/types.ts';

/**
 * Custom hook to get the `terms` of a specific policy, using the data from `useGetAuthorizedHolderPolicies`.
 * @param policyAddress The address of the policy whose terms you want to retrieve.
 * @param holderAddress The holder's address for which the policies are fetched.
 */
export const useGetPolicyTerms = (
  policyAddress?: Address,
  holderAddress?: Address
): UseGetPolicyTermsHook => {
  const [terms, setTerms] = useState<Terms | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<HasAccessError | null>(null);

  // Reuse the hook to get all authorized policies for the holder
  const {
    authorizedHolderPolicies,
    loading: loadingPolicies,
    error: errorPolicies,
    refetch: refetchPolicies,
  } = useGetPoliciesTerms(holderAddress);

  /**
   * Attempt to find `policyAddress` in the array of `authorizedHolderPolicies`
   * and extract its `terms`.
   */
  const fetchTerms = useCallback(() => {
    setFetching(true);

    // Validate inputs
    if (!policyAddress || !holderAddress) {
      // TODO change the approach here to handle errors?
      setTerms(undefined);
      setError({ message: 'Policy address or holder address is missing.' });
      setFetching(false);
      return;
    }

    // If there's an error from the getAuthorizedHolderPolicies hook, propagate it
    if (errorPolicies) {
      setTerms(undefined);
      setError(errorPolicies);
      setFetching(false);
      return;
    }

    // If we haven't fetched or there are no policies, we can't proceed yet
    if (!authorizedHolderPolicies || authorizedHolderPolicies.length === 0) {
      setTerms(undefined);
      setError(null);
      setFetching(false);
      return;
    }

    try {
      // Find the policy object with a matching address
      const foundPolicy = authorizedHolderPolicies.find(
        (p) => p.policy.toLowerCase() === policyAddress.toLowerCase()
      );

      if (foundPolicy) {
        setTerms(foundPolicy.terms);
        setError(null);
      } else {
        // If the policy is not found, we can consider that an "empty" or "not found" state
        setTerms(undefined);
        setError(null); // or setError({ message: 'Policy not found among authorized ones.' })
      }
    } catch (err) {
      console.error('Error filtering policy terms:', err);
      setTerms(undefined);
      setError({ message: err instanceof Error ? err.message : 'An error occurred while filtering policy terms.' });
    } finally {
      setFetching(false);
    }
  }, [loadingPolicies, authorizedHolderPolicies]);

  // Recompute whenever the authorizedHolderPolicies or errors change
  useEffect(fetchTerms, [fetchTerms]);

  // If no addresses are provided, return an immediate error (optional approach)
  if (!policyAddress || !holderAddress) {
    return {
      terms: undefined,
      loading: false,
      fetching: false,
      error: { message: 'Policy address or holder address is missing.' },
      refetch: () => Object,
    };
  }

  return {
    terms,
    refetch: refetchPolicies,
    loading: loadingPolicies, // Reflect the loading state of fetching authorized policies
    fetching, // Reflect the local fetching/checking state
    error,
  };
};
