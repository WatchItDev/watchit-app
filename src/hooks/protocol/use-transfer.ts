import { useState } from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { TransferParams, UseTransferHook } from '@src/hooks/protocol/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { TransferData } from "@src/hooks/types.ts"
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';

export const useTransfer = (): UseTransferHook => {
  const [data, setData] = useState<TransferData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { isFullyAuthenticated: isAuthenticated } = useAuth();

  const initializeTransfer = ({ recipient, amount }: TransferParams) => {
    const weiAmount = parseUnits(amount.toString(), 18);

    return encodeFunctionData({
      abi: LedgerVaultAbi.abi,
      functionName: 'transfer',
      args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
    });
  };

  const transfer = async ({ recipient, amount }: TransferParams) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError(ERRORS.TRANSFER_LOGIN_FIRST_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const transferData = initializeTransfer({ recipient, amount });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: transferData,
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
    } catch (err) {
      console.error('USE TRANSFER ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, transfer, loading, error };
};
