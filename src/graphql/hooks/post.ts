import { gql, useLazyQuery } from '@apollo/client';
import type { Post, PostByIdentifierInput, PostFilterInput, PaginationInput } from '@src/graphql/generated/graphql';
import { normalizePost, type NormalizedPost } from '@src/utils/post-normalizer';

type GetPostResult = { getPost?: Post | null };
type GetPostsResult = { getPosts: Post[] };

type GetPostsVariables = { input: PostFilterInput; page?: PaginationInput };

type LazyResult<T> = {
  data: T;
  loading: boolean;
  error?: unknown;
};

const GET_POST = gql`
  query GetPost($input: PostByIdentifierInput!) {
    getPost(input: $input) {
      id
      title
      body
      commentCount
      attachments {
        id
        cid
        title
        type
        url
      }
      base {
        id
        createdAt
        visibility
        user {
          id
          address
          displayName
          verified
          profile {
            username
            picture
            cover
            bio
          }
          socials {
            platform
            url
          }
        }
      }
    }
  }
`;

const GET_POSTS = gql`
  query GetPostsByFilter($input: PostFilterInput!, $page: PaginationInput) {
    getPosts(input: $input, page: $page) {
      id
      title
      body
      commentCount
      attachments {
        id
        cid
        title
        type
        url
      }
      base {
        id
        createdAt
        visibility
        user {
          id
          address
          displayName
          verified
          profile {
            username
            picture
            cover
            bio
          }
          socials {
            platform
            url
          }
        }
      }
    }
  }
`;

export function useGetPostLazy() {
  const [execute, result] = useLazyQuery<GetPostResult, { input: PostByIdentifierInput }>(GET_POST, {
    fetchPolicy: 'network-only',
  });

  const normalized: LazyResult<NormalizedPost | null> = {
    data: result.data?.getPost ? normalizePost(result.data.getPost) : null,
    loading: result.loading,
    error: result.error,
  };

  return [
    (variables: { input: PostByIdentifierInput }) => execute({ variables }),
    normalized,
  ] as const;
}

export function useGetPostsLazy(defaultInput: PostFilterInput = {}) {
  const [execute, result] = useLazyQuery<GetPostsResult, GetPostsVariables>(GET_POSTS, {
    fetchPolicy: 'network-only',
    variables: { input: defaultInput },
  });

  const normalized: LazyResult<NormalizedPost[]> = {
    data: (result.data?.getPosts ?? []).map(normalizePost),
    loading: result.loading,
    error: result.error,
  };

  return [
    async (variables?: { input?: PostFilterInput; page?: PaginationInput }) => {
      const res = await execute({
        variables: { input: variables?.input ?? defaultInput, page: variables?.page },
      });
      return (res.data?.getPosts ?? []).map(normalizePost);
    },
    normalized,
  ] as const;
}

export function useGetPostsByAuthorLazy() {
  return useGetPostsLazy();
}
