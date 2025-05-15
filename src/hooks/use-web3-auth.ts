// ----- useWeb3Auth.ts -----
import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/auth';
import { AccountAbstractionProvider } from '@src/hooks/types';
import { BundlerClient, SmartAccount } from 'viem/account-abstraction';

export const useWeb3Auth = () => {
  const { web3Auth } = useContext(AuthContext);
  if (!web3Auth) throw new Error('Auth not initialised');

  const aaProvider = web3Auth.options
    ?.accountAbstractionProvider as AccountAbstractionProvider | undefined;
  const bundlerClient: BundlerClient = aaProvider?.bundlerClient as BundlerClient;
  const smartAccount: SmartAccount = aaProvider?.smartAccount as SmartAccount;

  return useMemo(
    () => ({
      web3Auth,
      bundlerClient,
      smartAccount,
      provider:      aaProvider?.provider      ?? null,
    }),
    [aaProvider]
  );
};
