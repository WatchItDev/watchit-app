import { vi } from 'vitest';

vi.mock('@lens-protocol/react-web', () => ({
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
  createSharedDependencies: (config: any) => ({
    pollingInterval: config.sharedDependencies?.pollingInterval || 5000,
  }),
}));
