import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export const CreateCommentDocument = gql`
    mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    body
    parent {
      id
    }
    post {
      id
    }
    base {
      id
      createdAt
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
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const ToggleLikeDocument = gql`
    mutation ToggleLike($input: ToggleLikeInput!) {
  toggleLike(input: $input)
}
    `;
export type ToggleLikeMutationFn = Apollo.MutationFunction<ToggleLikeMutation, ToggleLikeMutationVariables>;

/**
 * __useToggleLikeMutation__
 *
 * To run a mutation, you first call `useToggleLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikeMutation, { data, loading, error }] = useToggleLikeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleLikeMutation(baseOptions?: Apollo.MutationHookOptions<ToggleLikeMutation, ToggleLikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleLikeMutation, ToggleLikeMutationVariables>(ToggleLikeDocument, options);
      }
export type ToggleLikeMutationHookResult = ReturnType<typeof useToggleLikeMutation>;
export type ToggleLikeMutationResult = Apollo.MutationResult<ToggleLikeMutation>;
export type ToggleLikeMutationOptions = Apollo.BaseMutationOptions<ToggleLikeMutation, ToggleLikeMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    id
    title
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const GetCommentsByPostDocument = gql`
    query GetCommentsByPost($postId: Int!, $limit: Int, $offset: Int) {
  getComments(input: {postId: $postId}, page: {limit: $limit, offset: $offset}) {
    id
    body
    post {
      id
    }
    parent {
      id
    }
    base {
      id
      createdAt
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

/**
 * __useGetCommentsByPostQuery__
 *
 * To run a query within a React component, call `useGetCommentsByPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsByPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsByPostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetCommentsByPostQuery(baseOptions: Apollo.QueryHookOptions<GetCommentsByPostQuery, GetCommentsByPostQueryVariables> & ({ variables: GetCommentsByPostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>(GetCommentsByPostDocument, options);
      }
export function useGetCommentsByPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>(GetCommentsByPostDocument, options);
        }
export function useGetCommentsByPostSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>(GetCommentsByPostDocument, options);
        }
export type GetCommentsByPostQueryHookResult = ReturnType<typeof useGetCommentsByPostQuery>;
export type GetCommentsByPostLazyQueryHookResult = ReturnType<typeof useGetCommentsByPostLazyQuery>;
export type GetCommentsByPostSuspenseQueryHookResult = ReturnType<typeof useGetCommentsByPostSuspenseQuery>;
export type GetCommentsByPostQueryResult = Apollo.QueryResult<GetCommentsByPostQuery, GetCommentsByPostQueryVariables>;
export const GetRepliesByCommentDocument = gql`
    query GetRepliesByComment($commentId: Int!, $limit: Int, $offset: Int) {
  getComments(
    input: {parentId: $commentId}
    page: {limit: $limit, offset: $offset}
  ) {
    id
    body
    post {
      id
    }
    parent {
      id
    }
    base {
      id
      createdAt
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

/**
 * __useGetRepliesByCommentQuery__
 *
 * To run a query within a React component, call `useGetRepliesByCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepliesByCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepliesByCommentQuery({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetRepliesByCommentQuery(baseOptions: Apollo.QueryHookOptions<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables> & ({ variables: GetRepliesByCommentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>(GetRepliesByCommentDocument, options);
      }
export function useGetRepliesByCommentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>(GetRepliesByCommentDocument, options);
        }
export function useGetRepliesByCommentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>(GetRepliesByCommentDocument, options);
        }
export type GetRepliesByCommentQueryHookResult = ReturnType<typeof useGetRepliesByCommentQuery>;
export type GetRepliesByCommentLazyQueryHookResult = ReturnType<typeof useGetRepliesByCommentLazyQuery>;
export type GetRepliesByCommentSuspenseQueryHookResult = ReturnType<typeof useGetRepliesByCommentSuspenseQuery>;
export type GetRepliesByCommentQueryResult = Apollo.QueryResult<GetRepliesByCommentQuery, GetRepliesByCommentQueryVariables>;
export const GetIsLikedDocument = gql`
    query GetIsLiked($targetId: Int!, $targetType: ReactionTargetType = POST) {
  getIsLiked(targetId: $targetId, targetType: $targetType)
}
    `;

/**
 * __useGetIsLikedQuery__
 *
 * To run a query within a React component, call `useGetIsLikedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsLikedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsLikedQuery({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      targetType: // value for 'targetType'
 *   },
 * });
 */
export function useGetIsLikedQuery(baseOptions: Apollo.QueryHookOptions<GetIsLikedQuery, GetIsLikedQueryVariables> & ({ variables: GetIsLikedQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsLikedQuery, GetIsLikedQueryVariables>(GetIsLikedDocument, options);
      }
export function useGetIsLikedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsLikedQuery, GetIsLikedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsLikedQuery, GetIsLikedQueryVariables>(GetIsLikedDocument, options);
        }
export function useGetIsLikedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIsLikedQuery, GetIsLikedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIsLikedQuery, GetIsLikedQueryVariables>(GetIsLikedDocument, options);
        }
export type GetIsLikedQueryHookResult = ReturnType<typeof useGetIsLikedQuery>;
export type GetIsLikedLazyQueryHookResult = ReturnType<typeof useGetIsLikedLazyQuery>;
export type GetIsLikedSuspenseQueryHookResult = ReturnType<typeof useGetIsLikedSuspenseQuery>;
export type GetIsLikedQueryResult = Apollo.QueryResult<GetIsLikedQuery, GetIsLikedQueryVariables>;
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