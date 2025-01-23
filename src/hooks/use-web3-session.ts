import { useWeb3Auth } from '@src/hooks/use-web3-auth';

/**
 * Returns useful objects from the web3 session:
 * - bundlerClient
 * - smartAccount
 * - provider
 */
export function useWeb3Session() {
  const { web3Auth } = useWeb3Auth();
  const accountAbstractionProvider: any = web3Auth?.options?.accountAbstractionProvider;
  const bundlerClient = accountAbstractionProvider?.bundlerClient;
  const smartAccount = accountAbstractionProvider?.smartAccount;
  const provider = accountAbstractionProvider?.provider;

  return {
    bundlerClient,
    smartAccount,
    provider,
  };
}
