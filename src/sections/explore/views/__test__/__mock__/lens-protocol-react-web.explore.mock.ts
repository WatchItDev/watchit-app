import { vi } from "vitest";
export const useExplorePublications = vi.fn(() => ({
  data: [
    {
      id: "publication1",
      metadata: {
        content: "This is a test publication",
      },
      globalStats: {
        upvotes: 10,
      },
    },
    {
      id: "publication2",
      metadata: {
        content: "Another test publication",
      },
      globalStats: {
        upvotes: 5,
      },
    },
  ],
  loading: false,
}));

export const usePublications = vi.fn(() => ({
  data: [
    {
      id: "publication1",
      metadata: {
        content: "This is a test publication",
      },
      globalStats: {
        upvotes: 8,
      },
    },
    {
      id: "publication2",
      metadata: {
        content: "Another test publication",
      },
      globalStats: {
        upvotes: 3,
      },
    },
  ],
  loading: false,
}));

export const useExploreProfiles = vi.fn(() => ({
  data: [
    {
      id: "profile1",
      metadata: {
        displayName: "Creator 1",
        bio: "A cool creator",
      },
    },
    {
      id: "profile2",
      metadata: {
        displayName: "Creator 2",
        bio: "Another cool creator",
      },
    },
    {
      id: "hiddenProfile",
      metadata: {
        displayName: "###HIDDEN### Hidden Creator",
        bio: "This creator is hidden",
      },
    },
  ],
  loading: false,
}));

export const useBookmarks = vi.fn(() => ({
  data: [],
}));

export const useBookmarkToggle = vi.fn(() => ({
  toggle: vi.fn(),
  loading: false,
}));

export const appId = (id: string) => `mocked-app-id-${id}`;

export const PublicationType = {
  Post: "Post",
};

export const ExplorePublicationType = {
  Post: "Post",
  Comment: "Comment",
  Mirror: "Mirror",
};

export const ExplorePublicationsOrderByType = {
  TopCommented: "TopCommented",
  TopCollected: "TopCollected",
  TopMirrored: "TopMirrored",
};

export const ExploreProfilesOrderByType = {
  LatestCreated: "LatestCreated",
};

export const LimitType = {
  Ten: 10,
  TwentyFive: 25,
  Fifty: 50,
};
