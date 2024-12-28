import { useState } from 'react';
import { useSelector } from 'react-redux';
import { encodeFunctionData, parseUnits } from 'viem';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';

interface VaultError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface WithdrawParams {
  recipient: string;
  amount: number;
}

interface UseWithdrawHook {
  data?: any;
  withdraw: (params: WithdrawParams) => Promise<void>;
  loading: boolean;
  error?: VaultError | null;
}

export const useWithdraw = (): UseWithdrawHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<VaultError | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  const { web3Auth } = useWeb3Auth();

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

    try {
      const accountAbstractionProvider = web3Auth.options.accountAbstractionProvider;
      // @ts-ignore
      const bundlerClient = accountAbstractionProvider.bundlerClient;
      // @ts-ignore
      const smartAccount = accountAbstractionProvider.smartAccount;

      if (!sessionData?.authenticated) {
        setError({ message: 'Please login to withdraw funds' });
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        setError({ message: 'Bundler client not available' });
        setLoading(false);
        return;
      }

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
      setError({ message: err.message || 'An error occurred', ...err });
      setLoading(false);
    }
  };

  return { data, withdraw, loading, error };
};
