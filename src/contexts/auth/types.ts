import { ProviderEvents, SafeEventEmitterProvider, Web3Auth } from '@web3auth/modal';
import type { BundlerClient, SmartAccount } from 'viem/account-abstraction';

export interface AuthContextProps {
  web3Auth: Web3Auth | null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  provider: SafeEventEmitterProvider<ProviderEvents> | null;
  bundlerClient: BundlerClient | null;
  smartAccount: SmartAccount | null;
  status: string;
  isInitialized: boolean;
  isInitializing: boolean;
  initError: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  userInfo?: Awaited<ReturnType<Web3Auth["getUserInfo"]>>;
}
