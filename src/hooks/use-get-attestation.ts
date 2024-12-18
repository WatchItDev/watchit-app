import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';

// LENS IMPORTS
import { ProfileSession, useSession } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import {useSelector} from "react-redux";

interface AttestationError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface UseGetAttestationHook {
  attestation?: string;
  loading: boolean;
  fetching: boolean;
  error?: AttestationError | null;
  refetch: () => void;
}

/**
 * Custom hook to get the attestation of a subscription.
 * @param recipient The address of the recipient of subscription.
 * @param holder The address of the holder of subscription.
 * @returns An object containing the attestation data, loading state, error, and a refetch function.
 */
export function useGetAttestation(recipient: Address, holder?: Address): UseGetAttestationHook {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  const [attestation, setAttestation] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<AttestationError | null>(null);

  const fetchAttestation = useCallback(async () => {
    setFetching(true);
    try {
      const attestationData: unknown = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        abi: SubscriptionPolicyAbi.abi,
        functionName: 'getAttestation',
        args: [recipient, holder ?? (userAddress as Address)],
      });

      const attestationStr = attestationData ? String(attestationData) : undefined;
      setAttestation(attestationStr);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching attestation:', err);
      setError({ message: err.message || 'An error occurred' });
      setAttestation(undefined);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [recipient, holder, userAddress]);

  useEffect(() => {
    if (!recipient || !(holder ?? userAddress)) {
      setLoading(false);
      setFetching(false);
      setError({ message: 'Recipient or holder address is missing.' });
      return;
    }
    fetchAttestation();
  }, [recipient, holder, userAddress, fetchAttestation]);

  const refetch = useCallback(() => {
    setFetching(true);
    fetchAttestation();
  }, [fetchAttestation]);

  return {
    attestation,
    loading,
    fetching,
    error,
    refetch,
  };
}
