import type { ExplorePost, GridItem } from '@src/sections/explore/types';

type FixtureOverrides<T> = Partial<T> & Record<string, any>;

export const createMockExplorePost = (overrides: FixtureOverrides<ExplorePost> = {}): ExplorePost => {
  const basePost = {
    __typename: 'Post',
    id: overrides.id ?? 1,
    title: overrides.title ?? 'Mock Post',
    body: overrides.body ?? 'Mock description',
    commentCount: overrides.commentCount ?? 3,
    attachments: overrides.attachments ?? [
      {
        __typename: 'MediaAttachment',
        id: 1,
        cid: 'poster-cid',
        title: 'poster square',
        type: 'image',
        url: 'https://example.com/poster.jpg',
      },
    ],
    base: overrides.base ?? {
      __typename: 'BaseContent',
      id: 10,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      visibility: 'PUBLIC',
      user: {
        __typename: 'User',
        id: 33,
        address: '0xcreator',
        displayName: 'Creator',
        email: 'creator@example.com',
        followersCount: 100,
        followingCount: 25,
        publicationsCount: 8,
        createdAt: '2024-01-01T00:00:00Z',
        profilePicture: 'https://example.com/avatar.png',
        coverPicture: 'https://example.com/cover.png',
        socials: [],
        verified: false,
        profile: {
          __typename: 'Profile',
          username: 'creator',
          bio: 'Bio',
          picture: 'https://example.com/avatar.png',
          cover: 'https://example.com/cover.png',
        },
      },
    },
    author: overrides.author ?? {
      id: 33,
      address: '0xcreator',
      displayName: 'Creator',
      username: 'creator',
      profilePicture: 'https://example.com/avatar.png',
      coverPicture: 'https://example.com/cover.png',
      bio: 'Bio',
      followersCount: 100,
      followingCount: 25,
      publicationsCount: 8,
    },
    description: overrides.description ?? 'Mock description',
    likeCount: overrides.likeCount ?? 42,
    bookmarkCount: overrides.bookmarkCount ?? 6,
    viewCount: overrides.viewCount ?? 500,
    shareCount: overrides.shareCount ?? 9,
    media: overrides.media ?? [
      {
        id: 'media-1',
        cid: 'poster-cid',
        title: 'poster square',
        type: 'image/jpeg',
        url: 'https://example.com/poster.jpg',
      },
    ],
  };

  return { ...basePost, ...overrides } as ExplorePost;
};

export const createMockGridItem = (overrides: FixtureOverrides<GridItem> = {}): GridItem => ({
  id: overrides.id ?? 'mock-item',
  type: overrides.type ?? 'regular',
  title: overrides.title ?? 'Mock Item',
  color: overrides.color ?? '#000',
  description: overrides.description,
  dimensions: overrides.dimensions ?? { width: 1, height: 1 },
  position: overrides.position ?? { x: 0, y: 0 },
  data: overrides.data ?? {},
});
