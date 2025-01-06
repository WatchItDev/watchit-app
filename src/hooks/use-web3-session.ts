import { useMemo } from 'react';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';

/**
 * Returns useful objects from the web3 session:
 * - bundlerClient
 * - smartAccount
 * - provider
 */
export function useWeb3Session() {
  const { web3Auth } = useWeb3Auth();
  const accountAbstractionProvider = web3Auth?.options?.accountAbstractionProvider;

  const bundlerClient = useMemo(() => {
    // @ts-ignore
    return accountAbstractionProvider?.bundlerClient || null;
  }, [accountAbstractionProvider]);

  const smartAccount = useMemo(() => {
    // @ts-ignore
    return accountAbstractionProvider?.smartAccount || null;
  }, [accountAbstractionProvider]);

  const provider = useMemo(() => {
    // @ts-ignore
    return accountAbstractionProvider?.provider || null;
  }, [accountAbstractionProvider]);

  return {
    bundlerClient,
    smartAccount,
    provider,
  };
}
