// REACT IMPORTS
import { useState } from 'react';

// ETHERS IMPORTS
import { ethers } from 'ethers';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import AccessWorkflowAbi from '@src/config/abi/AccessWorkflow.json';
import LedgerVaultabi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

// Define the shape of the subscription data
interface SubscribeData {
  receipt?: any; // The subscribe receipt, to get the transaction hash use receipt.transactionHash
}

// Define the shape of the error object
interface SubscribeError {
  message: string;
  code?: number;
  [key: string]: any; // For additional error properties
}

// Define the return type of the useSubscribe hook
interface UseSubscribeHook {
  data?: SubscribeData;
  subscribe: (params: SubscribeParams) => Promise<void>;
  loading: boolean;
  error?: SubscribeError | null;
}

// Parameters to be passed to the subscribe function
interface SubscribeParams {
  holderAddress: string; // The address to which the subscription applies
  amount: string; // The amount for the subscription in MMC tokens
}

// ----------------------------------------------------------------------

export const useSubscribe = (): UseSubscribeHook => {
  const [data, setData] = useState<SubscribeData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<SubscribeError | null>(null);
  const sessionData = useSelector((state: any) => state.auth.session);
  const { web3Auth } = useWeb3Auth();

  const transferToAccessAgreement = (approvalAmount: bigint): string => {
    return encodeFunctionData({
      abi: LedgerVaultabi.abi,
      functionName: 'transfer',
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

    try {
      // Retrieve the account abstraction provider, bundler client, and smart account
      const accountAbstractionProvider = web3Auth.options.accountAbstractionProvider;
      // @ts-ignore
      const bundlerClient = accountAbstractionProvider.bundlerClient;
      // @ts-ignore
      const smartAccount = accountAbstractionProvider.smartAccount;

      if (!sessionData?.authenticated) {
        setError({ message: 'Please login to subscribe' });
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        setError({ message: 'Bundler client not available' });
        setLoading(false);
        return;
      }

      const approvalAmountInWei = ethers.parseUnits(amount, 18); // Convert amount to BigInt (in Wei)
      const parties = [sessionData?.profile?.ownedBy.address]; // The parties involved in the agreement (e.g., the user's address)
      const payload = '0x'; // Additional payload data if needed

      // Prepare the transfer to access agreement
      const transferToAccessAgreementData = transferToAccessAgreement(approvalAmountInWei);

      // Prepare the access agreement data
      const registerAccessAgreementData = registerAccessAgreement(
        approvalAmountInWei,
        holderAddress,
        parties,
        payload
      );

      // Create the array of calls to be included in the user operation
      const calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: transferToAccessAgreementData,
        },
        {
          to: GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS,
          value: 0,
          data: registerAccessAgreementData,
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
      console.log('err:')
      console.log(err)
      // setError({ message: err.message || 'An error occurred', ...err });
      setLoading(false);
    }
  };

  return { data, subscribe, loading, error };
};
