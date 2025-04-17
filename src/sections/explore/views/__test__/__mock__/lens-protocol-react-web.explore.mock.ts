import { vi } from "vitest";
export const useExplorePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-1",
      metadata: {
        title: "Prueba de titulo",
        content: "Contenido de prueba para explorar publicaciones",
      },
      by: {
        id: "user-1",
        metadata: {
          picture: {
            optimized: {
              uri: "https://placehold.co/40x40",
            },
          },
          displayName: "Alex Talavera",
        },
        handle: {
          localName: "Alex200207",
        },
      },
      operations: {
        hasBookmarked: false,
      },
    },
    {
      id: "pub-1",
      metadata: {
        title: "Prueba de titulo",
        content: "Contenido de prueba para explorar publicaciones",
      },
      by: {
        id: "user-1",
        metadata: {
          picture: {
            optimized: {
              uri: "https://placehold.co/40x40",
            },
          },
          displayName: "Alex Talavera",
        },
        handle: {
          localName: "Alex200207",
        },
      },
      operations: {
        hasBookmarked: false,
      },
    },
  ],
  loading: false,
}));

export const usePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-1",
      globalStats: { upvotes: 500 },
      metadata: { content: "Publicación de prueba" },
    },
    {
      id: "pub-1",
      globalStats: { upvotes: 500 },
      metadata: { content: "Otra publicación de prueba" },
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
