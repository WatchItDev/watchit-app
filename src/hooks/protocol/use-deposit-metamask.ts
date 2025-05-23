import { useState } from 'react';
import { Address, parseUnits } from 'viem';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { notifyInfo } from '@src/libs/notifications/internal-notifications.ts';
import { INFO } from '@src/libs/notifications/info.ts';
import { useMetaMask } from '@src/hooks/use-metamask.ts';
import {DepositParams, UseDepositHook, UseDepositMetamaskData} from '@src/hooks/protocol/types.ts'

/**
 * Hook that allows the deposit flow to be made
 * using MetaMask (or any injected EOA) instead
 * of the smart wallet.
 */
export const useDepositMetamask = (): UseDepositHook => {
  const [data, setData] = useState<UseDepositMetamaskData |null >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { walletClient, account: address } = useMetaMask();

  const deposit = async ({ recipient, amount }: DepositParams) => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // 1) Convert the amount to Wei (18 decimals for MMC)
      const weiAmount = parseUnits(amount.toString(), 18);

      // Notify the user that we are sending approve transaction to the network
      notifyInfo(INFO.APPROVE_SENDING_CONFIRMATION, { options: { autoHideDuration: 3000 } });

      // 2) First transaction: approve
      const approveTxHash = await walletClient?.writeContract({
        address: GLOBAL_CONSTANTS.MMC_ADDRESS,
        abi: MMCAbi.abi,
        functionName: 'approve',
        args: [GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS, weiAmount],
        chain: undefined,
        account: address,
      });

      // Notify the user that we are now waiting for the approve transaction to be confirmed
      notifyInfo(INFO.APPROVE_WAITING_CONFIRMATION, { options: { autoHideDuration: 7000 } });

      // Wait for the approve transaction to be mined
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTxHash as Address,
      });

      // Notify the user that we are now sending the deposit transaction
      notifyInfo(INFO.DEPOSIT_SENDING_CONFIRMATION, { options: { autoHideDuration: 3000 } });

      // 3) Second transaction: deposit
      const depositTxHash = await walletClient?.writeContract({
        address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
        abi: LedgerVaultAbi.abi,
        functionName: 'deposit',
        args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
        chain: undefined,
        account: address,
      });

      // Notify the user that we are now waiting for the deposit transaction to be confirmed
      notifyInfo(INFO.DEPOSIT_WAITING_CONFIRMATION, { options: { autoHideDuration: 7000 } });

      // Wait for the deposit transaction to be mined
      const depositReceipt = await publicClient.waitForTransactionReceipt({
        hash: depositTxHash as Address,
      });

      // 4) Store data about both transactions
      setData({
        approveTxHash,
        depositTxHash,
        approveReceipt,
        depositReceipt,
      });
    } catch (err) {
      // If something fails (either approve or deposit), set an error
      console.log('DEPOSIT FAILING ERROR: ', err);
      setError(ERRORS.UNKNOWN_ERROR);
      throw err;
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return {
    data,
    deposit,
    loading,
    error,
  };
};
