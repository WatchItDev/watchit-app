import { useState } from 'react';
import { parseUnits } from 'viem';
import { ConnectWalletClient } from '@src/clients/viem/walletClient';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { publicClient } from '@src/clients/viem/publicClient';
import { useSnackbar } from 'notistack';
import {ERRORS} from "@notifications/errors.ts";

// SAME HERE
interface DepositParams {
  recipient: string; // The address receiving the deposit
  amount: number;    // Amount in "human" format (not in Wei)
}

// TODO this could be handled in one interface in a type.tsx file
// is duplicated in use-deposit, this MUST be reusable
interface UseDepositHook {
  data?: any;
  deposit: (params: DepositParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

/**
 * Hook that allows the deposit flow to be made
 * using MetaMask (or any injected EOA) instead
 * of the smart wallet.
 */
export const useDepositMetamask = (): UseDepositHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const deposit = async ({ recipient, amount }: DepositParams) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Connect to the wallet (MetaMask)
      const walletClient = await ConnectWalletClient();

      // 2) Retrieve the user's address from the wallet
      const [senderAddress] = await walletClient.requestAddresses();

      // 3) Convert the amount to Wei (18 decimals for MMC)
      const weiAmount = parseUnits(amount.toString(), 18);

      // Notify the user that we are sending approve transaction to the network
      enqueueSnackbar('Sending approve transaction to the network...', {
        variant: 'info',
        autoHideDuration: 3000,
      });

      // 4) First transaction: approve
      const approveTxHash = await walletClient.writeContract({
        address: GLOBAL_CONSTANTS.MMC_ADDRESS,
        abi: MMCAbi.abi,
        functionName: 'approve',
        args: [GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS, weiAmount],
        account: senderAddress,
      });

      // Notify the user that we are now waiting for the approve transaction to be confirmed
      enqueueSnackbar('Approve transaction broadcasted. Waiting for confirmation (1/2)...', {
        variant: 'info',
        autoHideDuration: 7000,
      });

      // Wait for the approve transaction to be mined
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTxHash,
      });

      // Notify the user that we are now sending the deposit transaction
      enqueueSnackbar('Sending deposit transaction to the network...', {
        variant: 'info',
        autoHideDuration: 3000,
      });

      // 5) Second transaction: deposit
      const depositTxHash = await walletClient.writeContract({
        address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
        abi: LedgerVaultAbi.abi,
        functionName: 'deposit',
        args: [recipient, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
        account: senderAddress,
      });

      // Notify the user that we are now waiting for the deposit transaction to be confirmed
      enqueueSnackbar('Deposit transaction broadcasted. Waiting for confirmation (2/2)...', {
        variant: 'info',
        autoHideDuration: 7000,
      });

      // Wait for the deposit transaction to be mined
      const depositReceipt = await publicClient.waitForTransactionReceipt({
        hash: depositTxHash,
      });

      // 6) Store data about both transactions
      setData({
        approveTxHash,
        depositTxHash,
        approveReceipt,
        depositReceipt,
      });
    } catch (err: any) {
      // If something fails (either approve or deposit), set an error
      setError(ERRORS.UNKNOWN_ERROR);
      throw err
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
