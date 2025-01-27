import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Address, encodeFunctionData, parseUnits } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';

interface WithdrawParams {
  recipient: Address;
  amount: number;
}

export interface UseWithdrawHook {
  data?: any;
  withdraw: (params: WithdrawParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export const useWithdraw = (): UseWithdrawHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  const initializeWithdraw = ({ recipient, amount }: WithdrawParams) => {
    const weiAmount = parseUnits(amount.toString(), 18);

    return encodeFunctionData({
      abi: LedgerVaultAbi.abi,
      functionName: 'withdraw',
      args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
    });
  };

  const withdraw = async ({ recipient, amount }: WithdrawParams) => {
    setLoading(true);
    setError(null);

    if (!sessionData?.authenticated) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      setLoading(false);
      return;
    }

    if (!isAuthenticated()) {
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const withdrawData = initializeWithdraw({ recipient, amount });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: withdrawData,
        },
      ];

      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });

      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData(receipt);
      setLoading(false);
    } catch (err: any) {
      console.error('USE WITHDRAW ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, withdraw, loading, error };
};
