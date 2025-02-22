import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@lens-protocol/react', () => ({
  createSharedDependencies: (config: any) => ({
    pollingInterval: config?.sharedDependencies?.pollingInterval || 5000,
  }),
  useLazyProfile: vi.fn(() => ({
    data: { id: '1', operations: { isFollowedByMe: { value: true } } },
    execute: vi.fn(),
    loading: false,
    error: null,
  })),
}));

vi.mock('@lens-protocol/react-web', () => {
  return {
    // Hooks
    useLazyProfile: vi.fn(() => ({
      data: { id: '1', operations: { isFollowedByMe: { value: true } } },
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useProfile: vi.fn(() => ({
      data: { id: '0x123', handle: 'testuser', name: 'Test User' },
      loading: false,
      error: null,
    })),
    usePublications: vi.fn(() => ({
      data: [
        {
          id: '0x456',
          content: 'This is a test publication',
        },
      ],
      loading: false,
      error: null,
    })),
    useSearchProfiles: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    useFollow: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useUnfollow: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useLogin: vi.fn(() => ({
      login: vi.fn(),
      loading: false,
      error: null,
    })),
    useLogout: vi.fn(() => ({
      logout: vi.fn(),
      loading: false,
      error: null,
    })),
    useCreateProfile: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useSetProfileMetadata: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useLazyProfiles: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    useReactionToggle: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useBookmarkToggle: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useReportProfile: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useReportPublication: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useSession: vi.fn(() => ({
      data: { profile: { id: 'session-profile-id' } },
      loading: false,
      error: null,
    })),
    useCreatePost: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useCreateComment: vi.fn(() => ({
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    useLazyPublications: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    useExploreProfiles: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    useExplorePublications: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    useBookmarks: vi.fn(() => ({
      data: [],
      loading: false,
      error: null,
    })),
    development: 'development',
    staging: 'staging',
    LensConfig: {},
    LensProvider: ({ children, config }) => children,
    IBindings: {},
    PublicationType: {},
    ProfileId: String,
    LoginError: class LoginError extends Error {},
    SessionType: {},
    ProfileReportReason: { SPAM: 'SPAM', INAPPROPRIATE: 'INAPPROPRIATE' },
    PublicationReportReason: { COPYRIGHT: 'COPYRIGHT', SPAM: 'SPAM' },
    ProfileSession: {},
    appId: 'test-app-id',
    ExploreProfilesOrderByType: { LATEST: 'LATEST', TOP: 'TOP' },
    ExplorePublicationsOrderByType: { LATEST: 'LATEST', TOP: 'TOP' },
    ExplorePublicationType: { ALL: 'ALL', MIRROR: 'MIRROR', POST: 'POST' },
    LimitType: { DEFAULT: 10 },
    publicationId: '0xpub',
    PublicationReactionType: { LIKE: 'LIKE', DISLIKE: 'DISLIKE' },
    hasReacted: vi.fn(() => false),
    createSharedDependencies: (config: any) => {
      return {
        pollingInterval: (config.sharedDependencies && config.sharedDependencies.pollingInterval) || 5000,
      };
    },
  };
});

import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '@redux/reducer';
import { BrowserRouter as Router } from 'react-router-dom';

import { URI } from '@lens-protocol/react';
import { LensProvider, staging } from '@lens-protocol/react-web';

import CarouselCreators from '@src/components/carousel/variants/CarouselCreators';
import { CarouselCreatorsProps } from '@src/components/carousel/types';
import { bindings } from '@src/auth/context/web3Auth/config/bindings.ts';

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

describe('[COMPONENTS]: CarouselCreators', () => {
  const mockData = [
    {
      id: '1',
      metadata: {
        picture: null,
        __typename: 'ProfileMetadata',
        bio: null,
        rawURI: 'https://watchit.movie' as URI,
        appId: null,
        coverPicture: null,
        displayName: 'Test User 1',
        attributes: null
      },
      __typename: "Profile",
      invitedBy: null,
    },
  ];

  const defaultProps: CarouselCreatorsProps = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
  };

  const store = createStore(rootReducer);
  const lensConfig = {
    environment: staging,
    bindings: bindings,
    sharedDependencies: {
      pollingInterval: 5000,
    },
  };

  const RenderComponent = () =>
    render(
      <ReduxProvider store={store}>
        <Router>
          <LensProvider config={lensConfig}>
            <CarouselCreators {...defaultProps} />
          </LensProvider>
        </Router>
      </ReduxProvider>
    );


  it('to match snapshot', () => {
    expect(RenderComponent().baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const { container } = RenderComponent();
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(mockData.length);
  });

  it('applies the correct carousel settings', () => {
    const { container } = RenderComponent();
    const slickTrack = container.querySelector('.slick-track');
    expect(slickTrack).toHaveStyle('height: 100%');
  });

  it('renders the title correctly', () => {
    const { getByText } = RenderComponent();
    expect(getByText('Test Carousel')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const { container } = render(<CarouselCreators {...emptyProps} />);
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
