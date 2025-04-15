// src/__mocks__/lens-protocol-react-web.ts

export const useExplorePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-2",
      globalStats: { upvotes: 456 },
      metadata: { content: "Publicación explorada" },
    },
  ],
  loading: false,
}));

export const usePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-1",
      globalStats: { upvotes: 123 },
      metadata: { content: "Publicación de prueba" },
    },
  ],
  loading: false,
}));

export const useBookmarkToggle = vi.fn(() => ({
  execute: vi.fn(),
  isPending: false,
}));

export const appId = (id: string) => id;

export const PublicationType = {
  Post: "Post",
};

export const ExplorePublicationType = {
  Post: "Post",
};

export const LimitType = {
  Ten: 10,
};

export const ExplorePublicationsOrderByType = {
  TopCommented: "TopCommented",
};
