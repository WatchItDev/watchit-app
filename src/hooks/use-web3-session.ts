import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import {AccountAbstractionProvider} from "@src/hooks/types.ts"
/**
 * Returns useful objects from the web3 session:
 * - bundlerClient
 * - smartAccount
 * - provider
 */
export function useWeb3Session() {
  const { web3Auth } = useWeb3Auth();
  const accountAbstractionProvider = web3Auth?.options?.accountAbstractionProvider as AccountAbstractionProvider;
  const bundlerClient = accountAbstractionProvider?.bundlerClient;
  const smartAccount = accountAbstractionProvider?.smartAccount;
  const provider = accountAbstractionProvider?.provider;

  return {
    bundlerClient,
    smartAccount,
    provider,
  };
}
