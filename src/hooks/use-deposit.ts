import { useState } from 'react';
import { useSelector } from 'react-redux';
import { encodeFunctionData, parseUnits } from 'viem';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import MMCAbi from '@src/config/abi/MMC.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';

interface VaultError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface DepositParams {
  recipient: string; // address
  amount: number;    // plain number
}

interface UseDepositHook {
  data?: any;
  deposit: (params: DepositParams) => Promise<void>;
  loading: boolean;
  error?: VaultError | null;
}

export const useDeposit = (): UseDepositHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<VaultError | null>(null);

  const { web3Auth } = useWeb3Auth();
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
      // TODO can be abstracted this logic to get this data in a hook?
      // i can see this code repeated on all te hooks
      // const [bundler, smart, provider] = useWeb3Session()


      const accountAbstractionProvider = web3Auth.options.accountAbstractionProvider;
      // @ts-ignore
      const bundlerClient = accountAbstractionProvider.bundlerClient;
      // @ts-ignore
      const smartAccount = accountAbstractionProvider.smartAccount;

      if (!sessionData?.authenticated) {
        setError({ message: 'Please login to deposit funds' });
        setLoading(false);
        return;
      }

      if (!bundlerClient) {
        // TODO improve the message to send back to user
        setError({ message: 'Bundler client not available' });
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
      // TODO bad idea send internal error to user
      console.log(err)
      setError({ message: err.message || 'An error occurred', ...err });
      setLoading(false);
    }
  };

  return { data, deposit, loading, error };
};
