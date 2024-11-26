// WAGMI IMPORTS
import { useReadContract } from 'wagmi';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import RightsPolicyAuthorizerAbi from '@src/config/abi/RightsPolicyAuthorizer.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';

// ----------------------------------------------------------------------

// Defines the structure of the error object returned by the useIsPolicyAuthorized hook.
interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

// Defines the return type of the useIsPolicyAuthorized hook.
interface UseIsPolicyAuthorizedHook {
  isAuthorized?: boolean;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

/**
 * Custom hook to check if a user has a policy authorized.
 * @param policy The address of the policy.
 * @param holder The address of the holder, if is not passed it take the current logged profile address.
 * @returns An object containing the access data, loading state, error, and a refetch function.
 */
export const useIsPolicyAuthorized = (policy: Address, holder?: Address): UseIsPolicyAuthorizedHook => {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  // Use the useReadContract hook to call the smart contract function
  const {
    data: auhtorizedData,
    isError: accessError,
    isLoading: isAccessLoading,
    isFetching: isAccessFetching,
    error: contractError,
    refetch,
  } = useReadContract({
    abi: RightsPolicyAuthorizerAbi.abi,
    address: GLOBAL_CONSTANTS.RIGHT_POLICY_AUTHORIZER,
    functionName: 'isPolicyAuthorized',
    args: [policy as Address, holder ?? userAddress as Address],
  });

  return {
    isAuthorized: auhtorizedData as boolean | undefined,
    loading: isAccessLoading,
    fetching: isAccessFetching,
    error: accessError ? { message: contractError?.message || 'An error occurred' } : null,
    refetch,
  };
};
