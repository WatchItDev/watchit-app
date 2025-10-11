import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import type { DocumentNode } from 'graphql';
const defaultOptions = {} as const;

export const GetPostDocument = gql`
    query GetPost($input: PostByIdentifierInput!) {
  getPost(input: $input) {
    base {
      active
      createdAt
      id
      user {
        address
        createdAt
        displayName
        email
        id
        profile {
          bio
          cover
          picture
          username
        }
        socials {
          platform
          url
        }
        verified
      }
      visibility
    }
    body
    id
    title
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables> & ({ variables: GetPostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export function useGetPostSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostSuspenseQueryHookResult = ReturnType<typeof useGetPostSuspenseQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts($input: PostFilterInput!, $getPostsPage2: PaginationInput) {
  getPosts(input: $input, page: $getPostsPage2) {
    id
    title
    body
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
        email
        profile {
          bio
          cover
          picture
          username
        }
        socials {
          platform
          url
        }
        verified
      }
    }
  }
}
    `;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      input: // value for 'input'
 *      getPostsPage2: // value for 'getPostsPage2'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables> & ({ variables: GetPostsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export function useGetPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsSuspenseQueryHookResult = ReturnType<typeof useGetPostsSuspenseQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;

// ---------------------------------------------------------------------------
// Temporary stubs for legacy hooks
// TODO: Replace each stub with real implementations when the API exposes the corresponding resolvers.

const stubAsyncResult = async () => ({ data: undefined } as Apollo.ApolloQueryResult<any>);

const createStubQueryState = () =>
  ({
    data: undefined,
    loading: false,
    error: undefined,
    networkStatus: Apollo.NetworkStatus.ready,
    called: false,
    refetch: stubAsyncResult,
    fetchMore: stubAsyncResult,
    startPolling: () => undefined,
    stopPolling: () => undefined,
    subscribeToMore: () => () => undefined,
    updateQuery: () => undefined,
    variables: undefined,
    client: undefined,
  }) as Apollo.QueryResult<any>;

const createStubMutationState = () =>
  ({
    data: undefined,
    loading: false,
    error: undefined,
    called: false,
    client: undefined,
    reset: () => undefined,
  }) as Apollo.MutationResult<any>;

const stubLazyExecutor = async (_options?: any) => ({ data: undefined } as Apollo.ApolloQueryResult<any>);

const stubMutationExecutor = async (_options?: any) => ({ data: undefined } as Apollo.FetchResult<any>);

export const GetTipsByBakerForPostDocument = {} as DocumentNode;
export const GetRecentPostsDocument = {} as DocumentNode;
export const GetLeaderboardDocument = {} as DocumentNode;
export const GetUnlockedPerksDocument = {} as DocumentNode;

export function useGetUserLazyQuery(): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to `getUser` query when backend endpoint is ready.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetUsersLazyQuery(): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to `getUsers` query when backend endpoint is ready.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetUserBookmarksQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to bookmarks query once available.
  return createStubQueryState();
}

export function useGetUserFollowersLazyQuery(): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to followers query once available.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetUserFollowingLazyQuery(): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to following query once available.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetPostsByAuthorLazyQuery(): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to author posts query once the API supports it.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetTipsByBakerForPostQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to tips query when tipping API is live.
  return createStubQueryState();
}

export function useGetRecentPostsQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to recent posts query when feed API is restored.
  return createStubQueryState();
}

export function useGetRecentPostsLazyQuery(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to recent posts query when feed API is restored.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetLeaderboardQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to leaderboard query once the achievements API is available.
  return createStubQueryState();
}

export function useGetUnlockedPerksQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to unlocked perks query when perks API is restored.
  return createStubQueryState();
}

export function useHasPerkLazyQuery(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to hasPerk query when perks API is ready.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useGetRanksCatalogQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to ranks catalog query when leaderboard API is ready.
  return createStubQueryState();
}

export function useGetAchievementsQuery(_baseOptions?: any): Apollo.QueryResult<any> {
  // TODO: Connect to achievements query when achievements API is ready.
  return createStubQueryState();
}

export function useCreateUserMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Wire creation mutation when user management API is enabled.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useUpdateUserMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Wire update mutation when user management API is enabled.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useCreateTipMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to tipping mutation once implemented.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useClaimPerkMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to claim perk mutation when achievements API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useToggleBookmarkMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to bookmark toggle mutation when API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useToggleLikeMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to like toggle mutation when reactions API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useGetIsLikedLazyQuery(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.ApolloQueryResult<any>>, Apollo.QueryResult<any>] {
  // TODO: Connect to like status query when reactions API is ready.
  return [stubLazyExecutor, createStubQueryState()];
}

export function useHidePostMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to hide post mutation when moderation API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useLogEventMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to logging mutation when analytics API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}

export function useIncrementPostViewMutation(_baseOptions?: any): readonly [(options?: any) => Promise<Apollo.FetchResult<any>>, Apollo.MutationResult<any>] {
  // TODO: Connect to post view increment mutation when metrics API is ready.
  return [stubMutationExecutor, createStubMutationState()];
}
