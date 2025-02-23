import { vi } from 'vitest';

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
