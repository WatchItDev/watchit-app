// REACT IMPORTS
import { useState } from 'react';

// VIEM IMPORTS
import { Address, encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import RightsPolicyAuthorizerAbi from '@src/config/abi/RightsPolicyAuthorizer.json';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import {AuthorizePolicyParams, UseAuthorizePolicyHook, UseAuthorizePolicyResult} from '@src/hooks/protocol/types.ts'
import { Calls, WaitForUserOperationReceiptReturnType } from '@src/hooks/types.ts'
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { getNonce } from '@src/utils/wallet.ts';

// ----------------------------------------------------------------------

export const useAuthorizePolicy = (): UseAuthorizePolicyHook => {
  const [data, setData] = useState<UseAuthorizePolicyResult | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { session } = useAuth();
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();

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

    if (!session?.authenticated) {
      setError(ERRORS.AUTHORIZATION_POLICY_ERROR);
      setLoading(false);
      logout();
      throw new Error('Invalid Web3Auth session');
    }

    try {
      // Prepare the authorize policy data
      const rightPolicyAuthorizerData = initializeAuthorizePolicy({
        policyAddress,
        data,
      });

      // Create the array of calls to be included in the user operation
      const calls: Calls = [
        {
          to: GLOBAL_CONSTANTS.RIGHT_POLICY_AUTHORIZER,
          value: 0,
          data: rightPolicyAuthorizerData,
        },
      ];

      // Send the user operation
      const userOpHash = await bundlerClient?.sendUserOperation({
        account: smartAccount,
        calls: calls,
        nonce: await getNonce(smartAccount)
      });

      // Wait for the user operation receipt
      const receipt: WaitForUserOperationReceiptReturnType = await bundlerClient?.waitForUserOperationReceipt({
        hash: userOpHash as Address,
      });

      // Update the state with the result
      setData(receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE AUTHORIZE POLICY ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, authorize, loading, error };
};
