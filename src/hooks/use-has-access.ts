// WAGMI IMPORTS
import { useReadContract } from 'wagmi';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth.ts';
import SubscriptionPolicyAbi from '@src/config/abi/SubscriptionPolicy.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

// Defines the structure of the error object returned by the useHasAccess hook.
interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

// Defines the return type of the useHasAccess hook.
interface UseHasAccessHook {
  hasAccess?: boolean;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

/**
 * Custom hook to check if the user has access to a publication.
 * @param ownerAddress The address of the owner of the publication.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useHasAccess = (ownerAddress?: Address): UseHasAccessHook => {
  const { selectedProfile } = useAuth();
  const userAddress = selectedProfile?.ownedBy?.address as Address | undefined;

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
    functionName: 'isAccessAllowed',
    args: [userAddress as Address, ownerAddress as Address],
  });

  if (!userAddress) return { hasAccess: false, loading: false, fetching: false, error: null, refetch: () => {}, }

  return {
    hasAccess: accessData as boolean | undefined,
    loading: isAccessLoading,
    fetching: isAccessFetching,
    error: accessError ? { message: contractError?.message || 'An error occurred' } : null,
    refetch,
  };
};
