// WAGMI IMPORTS
import { useReadContract } from 'wagmi';

// VIEM IMPORTS
import { Address } from 'viem';

// LENS IMPORTS
import { ProfileSession, useSession } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// LOCAL IMPORTS
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';

// ----------------------------------------------------------------------

// Defines the structure of the error object returned by the useGetAttestation hook.
interface AttestationError {
  message: string;
  code?: number;
  [key: string]: any;
}

// Defines the return type of the useGetAttestation hook.
interface UseGetAttestationook {
  attestation?: string;
  loading: boolean;
  fetching: boolean;
  error?: AttestationError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

/**
 * Custom hook to get the attestation of a subscription.
 * @param recipient The address of the recipient of subscription.
 * @param holder The address of the holder of subscription.
 * @returns An object containing the attestation data, loading state, error, and a refetch function.
 */
export const useGetAttestation = (recipient: Address, holder?: Address): UseGetAttestationook => {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  // Use the useReadContract hook to call the smart contract function
  const {
    data: attestationData,
    isError: attestationError,
    isLoading: isAttestationLoading,
    isFetching: isAttestationFetching,
    error: contractError,
    refetch,
  } = useReadContract({
    abi: SubscriptionPolicyAbi.abi,
    address: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    functionName: 'getAttestation',
    args: [recipient as Address, holder ?? userAddress as Address],
  });

  return {
    attestation: attestationData ? `${attestationData}` : undefined,
    loading: isAttestationLoading,
    fetching: isAttestationFetching,
    error: attestationError ? { message: contractError?.message || 'An error occurred' } : null,
    refetch,
  };
};
