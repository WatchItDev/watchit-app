// REACT IMPORTS
import { useState } from 'react';

// ETHERS IMPORTS

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import RightsPolicyAuthorizerAbi from '@src/config/abi/RightsPolicyAuthorizer.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';

// ----------------------------------------------------------------------

// Define the shape of the error object
interface AuthorizeError {
  message: string;
  code?: number;
  [key: string]: any; // For additional error properties
}

// Define the return type of the useAuthorizePolicy hook
interface useAuthorizePolicyHook {
  data?: any;
  authorize: (params: AuthorizePolicyParams) => Promise<void>;
  loading: boolean;
  error?: AuthorizeError | null;
}

// Parameters to be passed to the subscribe function
interface AuthorizePolicyParams {
  policyAddress: string; // The address to which the subscription applies
  data: any; // The encoded data. EJ. For subscription policy is encoded (Price per day, address mmc)
}

// ----------------------------------------------------------------------

export const useAuthorizePolicy = (): useAuthorizePolicyHook => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthorizeError | null>(null);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { web3AuthInstance } = useWeb3Auth();

  /**
   * Creates the flash policy agreement data.
   * @param holderAddress The owner address (e.g., 'holderAddress' parameter).
   * @param data The coded (Price per day, address mmc).
   * @returns The encoded function data for the flashPolicyAgreement call.
   */
  const initializeAuthorizePolicy = ({ policyAddress, data }: AuthorizePolicyParams): string => {
    return encodeFunctionData({
      abi: RightsPolicyAuthorizerAbi.abi,
      functionName: 'authorizePolicy',
      args: [policyAddress, data],
    });
  };

  /**
   * Initiates the authorization process.
   * @param params The parameters including 'amount'.
   */
  const authorize = async ({ policyAddress, data }: AuthorizePolicyParams): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Retrieve the account abstraction provider, bundler client, and smart account
      const accountAbstractionProvider =
        web3AuthInstance.options.accountAbstractionProvider;
      const bundlerClient = accountAbstractionProvider.bundlerClient;
      const smartAccount = accountAbstractionProvider.smartAccount;

      if (!sessionData?.authenticated) {
        setError({ message: 'Please login to authorize policy' });
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        setError({ message: 'Bundler client not available' });
        setLoading(false);
        return;
      }

      // Prepare the authorize policy data
      const rightPolicyAuthorizerData = initializeAuthorizePolicy({
        policyAddress,
        data
      });

      // Create the array of calls to be included in the user operation
      const calls = [
        {
          to: GLOBAL_CONSTANTS.RIGHT_POLICY_AUTHORIZER,
          value: 0,
          data: rightPolicyAuthorizerData,
        },
      ];

      // Send the user operation
      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls: calls,
      });

      // Wait for the user operation receipt
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      // Update the state with the result
      setData(receipt);
      setLoading(false);
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred', ...err });
      setLoading(false);
    }
  };

  return { data, authorize, loading, error };
};
