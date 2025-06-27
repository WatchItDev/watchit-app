import { useState } from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { UseWithdrawHook, WithdrawParams } from '@src/hooks/protocol/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { WithdrawData } from "@src/hooks/types.ts"
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls } from '@src/hooks/types.ts'

export const useWithdraw = (): UseWithdrawHook => {
  const [data, setData] = useState<WithdrawData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { sendOperation } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { session } = useAuth();

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

    if (!session.authenticated) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const withdrawData = initializeWithdraw({ recipient, amount });

      const calls: Calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: withdrawData,
        },
      ];

      const receipt = await sendOperation(calls);
      setData(receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE WITHDRAW ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, withdraw, loading, error };
};
