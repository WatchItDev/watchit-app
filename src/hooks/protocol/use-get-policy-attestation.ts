import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { useGetActiveLicenses } from '@src/hooks/protocol/use-get-active-licenses.ts';
import {
  HasAccessError,
  UseGetPolicyAttestationHook,
} from '@src/hooks/protocol/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

/**
 * Custom hook to get the attestation for a specific policy.
 * @param policy The address of the policy to check.
 * @param recipient The address of the recipient of subscription.
 * @param holder The address of the holder of subscription.
 * @returns An object containing the attestation data, loading state, error, and a refetch function.
 */
export function useGetPolicyAttestation(
  policy: Address,
  recipient: Address,
  holder?: Address,
): UseGetPolicyAttestationHook {
  const { session: sessionData } = useAuth();
  const [attestation, setAttestation] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<HasAccessError | null>(null);
  const {
    activeLicenses,
    loading: licensesLoading,
    refetch: refetchLicenses,
  } = useGetActiveLicenses(recipient, holder);
  const userAddress = sessionData?.address;

  const fetchAttestation = useCallback(() => {
    setFetching(true);

    if (!policy || licensesLoading) {
      setFetching(false);
      setLoading(false);
      return;
    }

    try {
      const matchedLicense = activeLicenses.find(
        (license) => license.policy.toLowerCase() === policy.toLowerCase(),
      );

      if (matchedLicense) {
        setAttestation(matchedLicense.license);
        setError(null);
      } else {
        setAttestation(undefined);
        setError({
          message: 'No matching license found for the specified policy.',
        });
      }
    } catch (err) {
      console.error('Error fetching license:', err);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError({ message: err?.message || 'An error occurred' });
      setAttestation(undefined);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [policy, activeLicenses, licensesLoading]);

  useEffect(() => {
    if (!policy || !recipient || !(holder ?? userAddress)) {
      setLoading(false);
      setFetching(false);
      setError({ message: 'Policy, recipient, or holder address is missing.' });
      return;
    }

    fetchAttestation();
  }, [policy, recipient, holder, userAddress, fetchAttestation]);

  const refetch = useCallback(() => {
    refetchLicenses();
    fetchAttestation();
  }, [refetchLicenses, fetchAttestation]);

  return {
    attestation,
    loading: licensesLoading || loading,
    fetching,
    error,
    refetch,
  };
}
