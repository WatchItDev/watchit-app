import {
  GetPostsDocument,
  GetUsersDocument,
} from '@src/graphql/generated/graphql';

export const searchbarMocks = [
  {
    request: {
      query: GetUsersDocument,
      variables: { limit: undefined, query: '' },
    },
    result: {
      data: {
        getUsers: [
          {
            address: '0x123',
            displayName: 'Test User',
            bio: 'Test bio',
            coverPicture: null,
            username: 'testuser',
            profilePicture: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: GetPostsDocument,
      variables: { query: '', limit: undefined },
    },
    result: {
      data: {
        getPosts: [
          {
            author: {
              address: '0x123',
              displayName: 'Test User',
              followersCount: 0,
              followingCount: 0,
              coverPicture: null,
              profilePicture: null,
              bio: 'Test bio',
              publicationsCount: 0,
              username: 'testuser',
            },
            bookmarkCount: 0,
            cid: 'cid123',
            commentCount: 0,
            createdAt: '2023-01-01T00:00:00Z',
            description: 'Test post',
            id: 'post1',
            likeCount: 0,
            media: [],
            title: 'Test Post',
            updatedAt: '2023-01-01T00:00:00Z',
            viewCount: 0,
            visibility: 'PUBLIC',
          },
        ],
      },
    },
  },
];
