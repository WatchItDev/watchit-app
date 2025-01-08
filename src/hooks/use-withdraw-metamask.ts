import { useState } from 'react';
import { parseUnits } from 'viem';

// Project imports
import { ConnectWalletClient } from '@src/clients/viem/walletClient';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { publicClient } from '@src/clients/viem/publicClient';

// Notifications
import { ERRORS } from '@notifications/errors.ts';
import { notifyInfo } from '@notifications/internal-notifications.ts';
import { INFO } from '@notifications/info.ts';

interface WithdrawParams {
  recipient: string; // Address receiving the funds
  amount: number; // Amount in "human" format (not in Wei)
}

interface UseWithdrawHook {
  data?: any;
  withdraw: (params: WithdrawParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

/**
 * Hook that allows the withdrawal flow to be made
 * using MetaMask (or any injected EOA) instead
 * of the smart wallet.
 */
export const useWithdrawMetamask = (): UseWithdrawHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  const withdraw = async ({ recipient, amount }: WithdrawParams) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Connect to the wallet (MetaMask)
      const walletClient = await ConnectWalletClient();

      // 2) Retrieve the user's address from the wallet
      const [senderAddress] = await walletClient.requestAddresses();

      // 3) Convert the amount to Wei (18 decimals)
      const weiAmount = parseUnits(amount.toString(), 18);

      // Notify the user that we are sending the withdraw transaction
      notifyInfo(INFO.WITHDRAW_SENDING_CONFIRMATION, {
        options: { autoHideDuration: 3000 },
      });

      // 4) Send the withdraw transaction
      const withdrawTxHash = await walletClient.writeContract({
        address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
        abi: LedgerVaultAbi.abi,
        functionName: 'withdraw',
        args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
        account: senderAddress,
      });

      // Notify the user that we are waiting for confirmation
      notifyInfo(INFO.WITHDRAW_WAITING_CONFIRMATION, {
        options: { autoHideDuration: 7000 },
      });

      // Wait for the withdraw transaction to be mined
      const withdrawReceipt = await publicClient.waitForTransactionReceipt({
        hash: withdrawTxHash,
      });

      // Store the transaction data
      setData({
        withdrawTxHash,
        withdrawReceipt,
      });
    } catch (err: any) {
      // If something fails, set an error
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return {
    data,
    withdraw,
    loading,
    error,
  };
};
