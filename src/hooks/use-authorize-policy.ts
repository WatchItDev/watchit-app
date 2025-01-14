// REACT IMPORTS
import { useState } from 'react';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import RightsPolicyAuthorizerAbi from '@src/config/abi/RightsPolicyAuthorizer.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';

// ----------------------------------------------------------------------
// Define the return type of the useAuthorizePolicy hook
interface useAuthorizePolicyHook {
  data?: any;
  authorize: (params: AuthorizePolicyParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
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
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();

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
      if (!sessionData?.authenticated) {
        setError(ERRORS.AUTHORIZATION_POLICY_ERROR);
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        setError(ERRORS.BUNDLER_UNAVAILABLE);
        setLoading(false);
        return;
      }

      // Prepare the authorize policy data
      const rightPolicyAuthorizerData = initializeAuthorizePolicy({
        policyAddress,
        data,
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
      console.log('err')
      console.log(err)
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, authorize, loading, error };
};
