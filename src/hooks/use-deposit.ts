import { useState } from 'react';
import { useSelector } from 'react-redux';
import { encodeFunctionData, parseUnits } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';

interface DepositParams {
  recipient: string; // address
  amount: number; // plain number
}

export interface UseDepositHook {
  data?: any;
  deposit: (params: DepositParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export const useDeposit = (): UseDepositHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const sessionData = useSelector((state: any) => state.auth.session);

  const approveMMC = (amount: number): string => {
    // Convert to Wei (assuming 18 decimals)
    const weiAmount = parseUnits(amount.toString(), 18);

    // Encode the approve function call data
    return encodeFunctionData({
      abi: MMCAbi.abi,
      functionName: 'approve',
      args: [GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS, weiAmount],
    });
  };

  /**
   * Encodes the call to LedgerVault’s `deposit` function.
   */
  const initializeDeposit = ({ recipient, amount }: DepositParams) => {
    // Convert to Wei (assuming 18 decimals)
    const weiAmount = parseUnits(amount.toString(), 18);
    return encodeFunctionData({
      abi: LedgerVaultAbi.abi,
      functionName: 'deposit',
      args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
    });
  };

  /**
   * Main function to perform a deposit.
   */
  const deposit = async ({ recipient, amount }: DepositParams) => {
    setLoading(true);
    setError(null);

    try {
      if (!sessionData?.authenticated) {
        setError(ERRORS.DEPOSIT_FAILED_ERROR);
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        setError(ERRORS.BUNDLER_UNAVAILABLE);
        setLoading(false);
        return;
      }

      const approveData = approveMMC(amount);
      const depositData = initializeDeposit({ recipient, amount });

      // Create the calls array
      const calls = [
        {
          to: GLOBAL_CONSTANTS.MMC_ADDRESS,
          value: 0,
          data: approveData,
        },
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: depositData,
        },
      ];

      // Send the user operation
      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });

      // Wait for the operation receipt
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData(receipt);
      setLoading(false);
    } catch (err: any) {

      setError(ERRORS.UNKNOWN_ERROR);

      console.error('USE DEPOSIT:', err);

      setLoading(false);
    }
  };

  return { data, deposit, loading, error };
};
