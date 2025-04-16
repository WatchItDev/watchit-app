export const useExplorePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-1",
      metadata: {
        title: "Título de prueba",
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
          localName: "juanp",
        },
      },
      operations: {
        hasBookmarked: false,
      },
    },
  ],
}));

export const usePublications = vi.fn(() => ({
  data: [
    {
      id: "pub-1",
      globalStats: { upvotes: 500},
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
