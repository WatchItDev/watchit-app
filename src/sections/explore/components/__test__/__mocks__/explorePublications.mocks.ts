import { GetAllPostsDocument } from "@src/graphql/generated/graphql";

export const explorePublicationsMocks = [
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
];
