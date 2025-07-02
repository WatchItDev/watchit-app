import { useMemo } from 'react';
import type { AccountAbstractionProvider } from '@web3auth/modal';
import { useWeb3Auth as useWeb3AuthAA } from '@web3auth/modal/react';

export const useWeb3Auth = () => {
  const { web3Auth } = useWeb3AuthAA();
  if (!web3Auth) throw new Error('Auth not initialised');

  const aaProvider = web3Auth.accountAbstractionProvider as AccountAbstractionProvider | undefined;
  return useMemo(
    () => ({
      web3Auth,
      bundlerClient: aaProvider?.bundlerClient ?? null,
      smartAccount:  aaProvider?.smartAccount  ?? null,
      provider:      aaProvider?.provider      ?? null,
    }),
    [aaProvider]
  );
};
