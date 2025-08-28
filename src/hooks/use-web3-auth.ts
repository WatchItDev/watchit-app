// ----- useWeb3Auth.ts -----
import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/auth';
import { AccountAbstractionProvider } from '@src/hooks/types';
import { BundlerClient, SmartAccount } from 'viem/account-abstraction';
import {
  Calls,
  WaitForUserOperationReceiptReturnType,
} from '@src/hooks/types.ts';
import { getNonce } from '@src/utils/wallet.ts';

export const useWeb3Auth = () => {
  const { web3Auth } = useContext(AuthContext);
  if (!web3Auth) throw new Error('Auth not initialised');

  const aaProvider = web3Auth.options?.accountAbstractionProvider as
    | AccountAbstractionProvider
    | undefined;
  const bundlerClient: BundlerClient =
    aaProvider?.bundlerClient as BundlerClient;
  const smartAccount: SmartAccount = aaProvider?.smartAccount as SmartAccount;

  const sendOperation = async (
    calls: Calls,
  ): WaitForUserOperationReceiptReturnType => {
    const op = {
      account: smartAccount,
      nonce: await getNonce(smartAccount),
      calls,
    };

    const userOpHash = await bundlerClient?.sendUserOperation(op);
    return bundlerClient?.waitForUserOperationReceipt({
      hash: userOpHash,
    });
  };

  return useMemo(
    () => ({
      web3Auth,
      sendOperation,
      bundlerClient,
      smartAccount,
      provider: aaProvider?.provider ?? null,
    }),
    [aaProvider],
  );
};
