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
