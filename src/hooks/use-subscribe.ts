// REACT IMPORTS
import { useState } from 'react';

// ETHERS IMPORTS
import { ethers } from 'ethers';

// VIEM IMPORTS
import { encodeFunctionData } from 'viem';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth.ts';
import MMCAbi from '@src/config/abi/MMC.json';
import AgreementPortalAbi from '@src/config/abi/AgreementPortal.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

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
  const { web3AuthInstance, selectedProfile } = useAuth();

  /**
   * Approves MMC tokens for the Agreement Portal.
   * @param amountInWei The amount of MMC tokens to approve (in Wei).
   * @param spenderAddress The address of the spender (Agreement Portal).
   * @returns The encoded function data for the approve call.
   */
  const approveMMC = (
    amountInWei: bigint
  ): string => {
    // Encode the approve function call data
    const approveData = encodeFunctionData({
      abi: MMCAbi.abi,
      functionName: 'approve',
      args: [GLOBAL_CONSTANTS.AGREEMENT_PORTAL_ADDRESS, amountInWei],
    });

    return approveData;
  };

  /**
   * Creates the flash policy agreement data.
   * @param approvalAmount The amount approved for the agreement (in Wei).
   * @param holderAddress The owner address (e.g., 'holderAddress' parameter).
   * @param parties The parties involved in the agreement.
   * @param payload Additional payload data.
   * @returns The encoded function data for the flashPolicyAgreement call.
   */
  const createFlashPolicyAgreement = (
    approvalAmount: bigint,
    holderAddress: string,
    parties: string[],
    payload: string
  ): string => {
    // Encode the flashPolicyAgreement function call data
    const flashPolicyAgreementData = encodeFunctionData({
      abi: AgreementPortalAbi.abi,
      functionName: 'flashPolicyAgreement',
      args: [
        approvalAmount,
        holderAddress,
        GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        parties,
        payload,
      ],
    });

    return flashPolicyAgreementData;
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
      const accountAbstractionProvider =
        web3AuthInstance.options.accountAbstractionProvider;
      const bundlerClient = accountAbstractionProvider.bundlerClient;
      const smartAccount = accountAbstractionProvider.smartAccount;

      if (!selectedProfile) {
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
      const parties = [selectedProfile.ownedBy.address]; // The parties involved in the agreement (e.g., the user's address)
      const payload = '0x'; // Additional payload data if needed

      // Prepare the approve MMC data
      const approveData = approveMMC(approvalAmountInWei);

      // Prepare the flash policy agreement data
      const flashPolicyAgreementData = createFlashPolicyAgreement(
        approvalAmountInWei,
        holderAddress,
        parties,
        payload
      );

      // Create the array of calls to be included in the user operation
      const calls = [
        {
          to: GLOBAL_CONSTANTS.MMC_ADDRESS,
          value: 0,
          data: approveData,
        },
        {
          to: GLOBAL_CONSTANTS.AGREEMENT_PORTAL_ADDRESS,
          value: 0,
          data: flashPolicyAgreementData,
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

  return { data, subscribe, loading, error };
};
