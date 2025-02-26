import { vi } from 'vitest';

vi.mock('@web3auth/auth', () => {
  class Web3AuthMock {
    constructor(config: any) {
      this.config = config;
    }

    async initModal() {
      return Promise.resolve();
    }

    async connect() {
      return Promise.resolve({
        userInfo: {
          name: 'Test User',
          profileImage: 'https://example.com/avatar.png',
          email: 'test@example.com',
        },
      });
    }

    async logout() {
      return Promise.resolve(true);
    }
  }
  const subkeyMock = {
    mimcsponge: vi.fn(),
    keccak256Padded: vi.fn().mockReturnValue(''),
    mimcGetConstants: vi.fn(),
  };

  return {
    Web3Auth: Web3AuthMock,
    initWeb3Auth: vi.fn().mockResolvedValue({
      connect: vi.fn().mockResolvedValue({
        userInfo: { name: 'Test User From initWeb3Auth' },
      }),
    }),
    subkey: subkeyMock,
  };
});

vi.mock('@web3auth/modal', () => {
  class Web3AuthModal {
    constructor(config: any) {
      this.config = config;
    }
    async initModal() {
      return Promise.resolve();
    }
    async connect() {
      return Promise.resolve({
        session: {
          token: 'fake_session_token',
        },
      });
    }
    async logout() {
      return Promise.resolve(true);
    }
  }

  return {
    Web3Auth: Web3AuthModal,
  };
});

vi.mock('@web3auth/base', () => {
  class Web3AuthCore {
    constructor(options: any) {
      this.options = options;
    }
    async init() {
      return Promise.resolve();
    }
    async connectTo(providerName: string) {
      return Promise.resolve({
        provider: providerName,
      });
    }
    async logout() {
      return Promise.resolve(true);
    }
  }

  const ADAPTER_EVENTS = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    ERRORED: 'errored',
  };

  const CHAIN_NAMESPACES = {
    EIP155: 'eip155',
    SOLANA: 'solana',
    OTHER: 'other',
  };
  const WEB3AUTH_NETWORK = {
    MAINNET: 'mainnet',
    TESTNET: 'testnet',
    SAPPHIRE_DEVNET: 'sapphire_devnet',
    SAPPHIRE_MAINNET: 'sapphire_mainnet',
  };

  const WALLET_ADAPTERS = {
    AUTH: 'AUTH',
  };

  return {
    Web3AuthCore,
    ADAPTER_EVENTS,
    CHAIN_NAMESPACES,
    WEB3AUTH_NETWORK,
    WALLET_ADAPTERS
  };
});

vi.mock('@web3auth/ethereum-provider', () => {
  class EthereumPrivateKeyProvider {
    static async fromPrivateKey(privateKey: string) {
      return Promise.resolve({
        request: vi.fn().mockResolvedValue(true),
        privateKey,
      });
    }
  }

  return {
    EthereumPrivateKeyProvider,
  };
});

vi.mock('@web3auth/account-abstraction-provider', () => {
  class AccountAbstractionProvider {
    config: any;
    constructor(config: any) {
      this.config = config;
    }
    async enable() {
      return Promise.resolve(true);
    }
  }

  class KernelSmartAccount {
    config: any;
    constructor(config: any) {
      this.config = config;
    }
    async init() {
      return Promise.resolve(true);
    }
    async performAction(action: string) {
      return Promise.resolve(`Action ${action} completed`);
    }
  }

  return {
    AccountAbstractionProvider,
    KernelSmartAccount,
  };
});

vi.mock('@web3auth/modal-react-hooks', () => {
  const useWeb3Auth = () => {
    return {
      web3AuthInstance: {},
      provider: null,
      isLoading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  };

  return { useWeb3Auth };
});
