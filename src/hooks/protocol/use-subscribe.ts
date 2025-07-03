// REACT IMPORTS
import { useState } from 'react';

// ETHERS IMPORTS
import { ethers } from 'ethers';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import AccessWorkflowAbi from '@src/config/abi/AccessWorkflow.json';
import LedgerVaultabi from '@src/config/abi/LedgerVault.json';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { SubscribeData, SubscribeParams, UseSubscribeHook } from '@src/hooks/protocol/types.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls } from '@src/hooks/types.ts'

// ----------------------------------------------------------------------

export const useSubscribe = (): UseSubscribeHook => {
  const [data, setData] = useState<SubscribeData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { session } = useAuth();
  const { sendOperation } = useWeb3Auth();
  const { logout } = useAccountSession();


  const approveToAccessAgreement = (approvalAmount: bigint): string => {
    return encodeFunctionData({
      abi: LedgerVaultabi.abi,
      functionName: 'approve',
      args: [
        GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS,
        approvalAmount,
        GLOBAL_CONSTANTS.MMC_ADDRESS,
      ],
    });
  };

  const registerAccessAgreement = (
    approvalAmount: bigint,
    holderAddress: string,
    parties: string[],
    payload: string
  ): string => {
    return encodeFunctionData({
      abi: AccessWorkflowAbi.abi,
      functionName: 'registerAccessAgreement',
      args: [
        approvalAmount,
        holderAddress,
        GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        parties,
        payload,
      ],
    });
  };

  /**
   * Initiates the subscription process.
   * @param params The parameters including 'holderAddress' and 'amount'.
   */
  const subscribe = async ({ holderAddress, amount }: SubscribeParams): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!session?.authenticated) {
      setError(ERRORS.SUBSCRIBE_LOGIN_ERROR);
      setLoading(false);
      logout()
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const approvalAmountInWei = ethers.parseUnits(amount, 18); // Convert amount to BigInt (in Wei)
      const parties = [session?.address ?? '']; // The parties involved in the agreement (e.g., the user's address)
      const payload = '0x'; // Additional payload data if needed

      // Prepare the approve to access agreement
      const approveToAccessAgreementData = approveToAccessAgreement(approvalAmountInWei);

      // Prepare the access agreement data
      const registerAccessAgreementData = registerAccessAgreement(
        approvalAmountInWei,
        holderAddress,
        parties,
        payload
      );

      // Create the array of calls to be included in the user operation
      const calls: Calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: approveToAccessAgreementData,
        },
        {
          to: GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS,
          value: 0,
          data: registerAccessAgreementData,
        },
      ];

      const receipt = await sendOperation(calls);

      // Update the state with the result
      setData(receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE SUBSCRIBE ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, subscribe, loading, error };
};
