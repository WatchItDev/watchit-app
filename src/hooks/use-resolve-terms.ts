// WAGMI IMPORTS
import { useReadContract } from 'wagmi';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';

// ----------------------------------------------------------------------

// Defines the structure of the error object returned by the useResolveTerms hook.
interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

// Defines the return type of the useResolveTerms hook.
interface UseResolveTermsHook {
  terms?: any;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

/**
 * Custom hook to check if the user has access to a publication.
 * @param holderAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useResolveTerms = (holderAddress?: Address): UseResolveTermsHook => {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  // Use the useReadContract hook to call the smart contract function
  const {
    data: accessData,
    isError: accessError,
    isLoading: isAccessLoading,
    isFetching: isAccessFetching,
    error: contractError,
    refetch,
  } = useReadContract({
    abi: SubscriptionPolicyAbi.abi,
    address: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    functionName: 'resolveTerms',
    args: [holderAddress as Address],
  });

  if (!userAddress) return { terms: false, loading: false, fetching: false, error: null, refetch: () => {}, }

  return {
    terms: accessData as boolean | undefined,
    loading: isAccessLoading,
    fetching: isAccessFetching,
    error: accessError ? { message: contractError?.message || 'An error occurred' } : null,
    refetch,
  };
};
