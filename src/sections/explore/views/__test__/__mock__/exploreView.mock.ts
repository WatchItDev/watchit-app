import {
  GetAllPostsDocument,
  GetPopularPostsDocument,
  GetRecentUsersDocument,
} from "@src/graphql/generated/graphql";

export const exploreViewMock = [
  {
    request: {
      query: GetAllPostsDocument,
      variables: {
        limit: 10,
      },
    },
    result: {
      data: {
        getAllPosts: [
          {
            id: "1",
            title: "Título de prueba",
            description: "Descripción",
            visibility: "PUBLIC",
            commentCount: 0,
            likeCount: 0,
            bookmarkCount: 0,
            viewCount: 0,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            cid: "somecid",
            author: {
              address: "0x123",
              displayName: "Autor Prueba",
              followersCount: 10,
              followingCount: 5,
              coverPicture: "cover.jpg",
              profilePicture: "profile.jpg",
              bio: "Bio",
              publicationsCount: 2,
              username: "autorprueba",
              __typename: "User",
            },
            media: [],
            __typename: "Post",
          },
        ],
      },
    },
  },
  {
    request: {
      query: GetPopularPostsDocument,
      variables: {
        limit: 10,
      },
    },
    result: {
      data: {
        getPopularPosts: [
          {
            id: "2",
            title: "Popular Post",
            description: "Popular Description",
            visibility: "PUBLIC",
            commentCount: 1,
            likeCount: 2,
            bookmarkCount: 3,
            viewCount: 4,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            cid: "popularcid",
            author: {
              address: "0x456",
              displayName: "Popular Author",
              followersCount: 20,
              followingCount: 10,
              coverPicture: "cover2.jpg",
              profilePicture: "profile2.jpg",
              bio: "Popular Bio",
              publicationsCount: 5,
              username: "popularauthor",
              __typename: "User",
            },
            media: [],
            __typename: "Post",
          },
        ],
      },
    },
  },
  {
    request: {
      query: GetRecentUsersDocument,
      variables: {
        limit: 50,
      },
    },
    result: {
      data: {
        getRecentUsers: [
          {
            address: "0x789",
            bio: "Recent User Bio",
            bookmarksCount: 1,
            coverPicture: "cover3.jpg",
            createdAt: new Date().toISOString(),
            displayName: "Recent User",
            followersCount: 5,
            followingCount: 2,
            profilePicture: "profile3.jpg",
            publicationsCount: 1,
            socialLinks: [],
            updatedAt: new Date().toISOString(),
            username: "recentuser",
            verified: false,
            xpBalance: 100,
            __typename: "User",
          },
        ],
      },
    },
  },
];
