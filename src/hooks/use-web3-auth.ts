import { Address } from 'viem';
import { useMemo } from 'react';
import { getNonce } from '@src/utils/wallet.ts';
import { useWeb3Auth as useWeb3AuthAA } from '@web3auth/modal/react';
import { Calls, WaitForUserOperationReceiptReturnType } from '@src/hooks/types.ts'
import type { AccountAbstractionProvider } from '@web3auth/modal';

export const useWeb3Auth = () => {
  const { web3Auth } = useWeb3AuthAA();
  if (!web3Auth) throw new Error('Auth not initialised');

  const aaProvider = web3Auth.accountAbstractionProvider as AccountAbstractionProvider | undefined;
  const bundlerClient = aaProvider?.bundlerClient ?? null;
  const smartAccount = aaProvider?.smartAccount  ?? null;

  const sendOperation = async (calls: Calls): WaitForUserOperationReceiptReturnType => {
    const op = {
      account: smartAccount,
      nonce: await getNonce(smartAccount),
      // balance: parseEther("100"),
      calls
    }

    const userOpHash = await bundlerClient?.sendUserOperation(op);
    return bundlerClient?.waitForUserOperationReceipt({
      hash: userOpHash as Address,
    });
  }

  return useMemo(
    () => ({
      web3Auth,
      sendOperation,
      bundlerClient,
      smartAccount,
      provider: aaProvider?.provider ?? null,
    }),
    [aaProvider]
  );
};
