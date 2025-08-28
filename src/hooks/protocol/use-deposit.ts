// REACT IMPORTS
import { useState } from 'react';

// VIEM IMPORTS
import { encodeFunctionData, parseUnits } from 'viem';

// LOCAL IMPORTS
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import MMCAbi from '@src/config/abi/MMC.json';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import {
  DepositParams,
  UseDepositHook,
  UseDepositResult,
} from '@src/hooks/protocol/types.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls } from '@src/hooks/types.ts';

export const useDeposit = (): UseDepositHook => {
  const [data, setData] = useState<UseDepositResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { sendOperation } = useWeb3Auth();
  const { session } = useAuth();
  const { logout } = useAccountSession();

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

    if (!session?.authenticated) {
      setError(ERRORS.DEPOSIT_FAILED_ERROR);
      setLoading(false);
      logout();
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const approveData = approveMMC(amount);
      const depositData = initializeDeposit({ recipient, amount });

      // Create the calls array
      const calls: Calls = [
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

      const receipt = await sendOperation(calls);

      setData(receipt);

      console.log('Deposit Receipt:', receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE DEPOSIT ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, deposit, loading, error };
};
