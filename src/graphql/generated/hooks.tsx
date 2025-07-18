import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export const ToggleBookmarkDocument = gql`
    mutation ToggleBookmark($input: BookmarkInput!) {
  toggleBookmark(input: $input)
}
    `;
export type ToggleBookmarkMutationFn = Apollo.MutationFunction<ToggleBookmarkMutation, ToggleBookmarkMutationVariables>;

/**
 * __useToggleBookmarkMutation__
 *
 * To run a mutation, you first call `useToggleBookmarkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleBookmarkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleBookmarkMutation, { data, loading, error }] = useToggleBookmarkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleBookmarkMutation(baseOptions?: Apollo.MutationHookOptions<ToggleBookmarkMutation, ToggleBookmarkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleBookmarkMutation, ToggleBookmarkMutationVariables>(ToggleBookmarkDocument, options);
      }
export type ToggleBookmarkMutationHookResult = ReturnType<typeof useToggleBookmarkMutation>;
export type ToggleBookmarkMutationResult = Apollo.MutationResult<ToggleBookmarkMutation>;
export type ToggleBookmarkMutationOptions = Apollo.BaseMutationOptions<ToggleBookmarkMutation, ToggleBookmarkMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    author {
      address
      displayName
    }
    content
    id
    createdAt
    likeCount
    parentComment {
      id
      content
    }
    post {
      id
      title
    }
    updatedAt
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
export const HideCommentDocument = gql`
    mutation HideComment($commentId: String!) {
  hideComment(commentId: $commentId)
}
    `;
export type HideCommentMutationFn = Apollo.MutationFunction<HideCommentMutation, HideCommentMutationVariables>;

/**
 * __useHideCommentMutation__
 *
 * To run a mutation, you first call `useHideCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideCommentMutation, { data, loading, error }] = useHideCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useHideCommentMutation(baseOptions?: Apollo.MutationHookOptions<HideCommentMutation, HideCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HideCommentMutation, HideCommentMutationVariables>(HideCommentDocument, options);
      }
export type HideCommentMutationHookResult = ReturnType<typeof useHideCommentMutation>;
export type HideCommentMutationResult = Apollo.MutationResult<HideCommentMutation>;
export type HideCommentMutationOptions = Apollo.BaseMutationOptions<HideCommentMutation, HideCommentMutationVariables>;
export const UpdateCommentDocument = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    content
    updatedAt
    createdAt
  }
}
    `;
export type UpdateCommentMutationFn = Apollo.MutationFunction<UpdateCommentMutation, UpdateCommentMutationVariables>;

/**
 * __useUpdateCommentMutation__
 *
 * To run a mutation, you first call `useUpdateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCommentMutation, { data, loading, error }] = useUpdateCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCommentMutation, UpdateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument, options);
      }
export type UpdateCommentMutationHookResult = ReturnType<typeof useUpdateCommentMutation>;
export type UpdateCommentMutationResult = Apollo.MutationResult<UpdateCommentMutation>;
export type UpdateCommentMutationOptions = Apollo.BaseMutationOptions<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const ToggleFollowDocument = gql`
    mutation ToggleFollow($input: FollowInput!) {
  toggleFollow(input: $input)
}
    `;
export type ToggleFollowMutationFn = Apollo.MutationFunction<ToggleFollowMutation, ToggleFollowMutationVariables>;

/**
 * __useToggleFollowMutation__
 *
 * To run a mutation, you first call `useToggleFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleFollowMutation, { data, loading, error }] = useToggleFollowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleFollowMutation(baseOptions?: Apollo.MutationHookOptions<ToggleFollowMutation, ToggleFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleFollowMutation, ToggleFollowMutationVariables>(ToggleFollowDocument, options);
      }
export type ToggleFollowMutationHookResult = ReturnType<typeof useToggleFollowMutation>;
export type ToggleFollowMutationResult = Apollo.MutationResult<ToggleFollowMutation>;
export type ToggleFollowMutationOptions = Apollo.BaseMutationOptions<ToggleFollowMutation, ToggleFollowMutationVariables>;
export const ToggleLikeDocument = gql`
    mutation ToggleLike($input: LikeInput!) {
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
export const ClaimPerkDocument = gql`
    mutation ClaimPerk($perkId: ID!) {
  claimPerk(perkId: $perkId)
}
    `;
export type ClaimPerkMutationFn = Apollo.MutationFunction<ClaimPerkMutation, ClaimPerkMutationVariables>;

/**
 * __useClaimPerkMutation__
 *
 * To run a mutation, you first call `useClaimPerkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimPerkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimPerkMutation, { data, loading, error }] = useClaimPerkMutation({
 *   variables: {
 *      perkId: // value for 'perkId'
 *   },
 * });
 */
export function useClaimPerkMutation(baseOptions?: Apollo.MutationHookOptions<ClaimPerkMutation, ClaimPerkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClaimPerkMutation, ClaimPerkMutationVariables>(ClaimPerkDocument, options);
      }
export type ClaimPerkMutationHookResult = ReturnType<typeof useClaimPerkMutation>;
export type ClaimPerkMutationResult = Apollo.MutationResult<ClaimPerkMutation>;
export type ClaimPerkMutationOptions = Apollo.BaseMutationOptions<ClaimPerkMutation, ClaimPerkMutationVariables>;
export const LogAnonymousEventDocument = gql`
    mutation LogAnonymousEvent($input: LogEventInput!) {
  logAnonymousEvent(input: $input)
}
    `;
export type LogAnonymousEventMutationFn = Apollo.MutationFunction<LogAnonymousEventMutation, LogAnonymousEventMutationVariables>;

/**
 * __useLogAnonymousEventMutation__
 *
 * To run a mutation, you first call `useLogAnonymousEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogAnonymousEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logAnonymousEventMutation, { data, loading, error }] = useLogAnonymousEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogAnonymousEventMutation(baseOptions?: Apollo.MutationHookOptions<LogAnonymousEventMutation, LogAnonymousEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogAnonymousEventMutation, LogAnonymousEventMutationVariables>(LogAnonymousEventDocument, options);
      }
export type LogAnonymousEventMutationHookResult = ReturnType<typeof useLogAnonymousEventMutation>;
export type LogAnonymousEventMutationResult = Apollo.MutationResult<LogAnonymousEventMutation>;
export type LogAnonymousEventMutationOptions = Apollo.BaseMutationOptions<LogAnonymousEventMutation, LogAnonymousEventMutationVariables>;
export const LogEventDocument = gql`
    mutation LogEvent($input: LogEventInput!) {
  logEvent(input: $input)
}
    `;
export type LogEventMutationFn = Apollo.MutationFunction<LogEventMutation, LogEventMutationVariables>;

/**
 * __useLogEventMutation__
 *
 * To run a mutation, you first call `useLogEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logEventMutation, { data, loading, error }] = useLogEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLogEventMutation(baseOptions?: Apollo.MutationHookOptions<LogEventMutation, LogEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogEventMutation, LogEventMutationVariables>(LogEventDocument, options);
      }
export type LogEventMutationHookResult = ReturnType<typeof useLogEventMutation>;
export type LogEventMutationResult = Apollo.MutationResult<LogEventMutation>;
export type LogEventMutationOptions = Apollo.BaseMutationOptions<LogEventMutation, LogEventMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    description
    createdAt
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const HidePostDocument = gql`
    mutation HidePost($postId: String!) {
  hidePost(postId: $postId)
}
    `;
export type HidePostMutationFn = Apollo.MutationFunction<HidePostMutation, HidePostMutationVariables>;

/**
 * __useHidePostMutation__
 *
 * To run a mutation, you first call `useHidePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHidePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hidePostMutation, { data, loading, error }] = useHidePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useHidePostMutation(baseOptions?: Apollo.MutationHookOptions<HidePostMutation, HidePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HidePostMutation, HidePostMutationVariables>(HidePostDocument, options);
      }
export type HidePostMutationHookResult = ReturnType<typeof useHidePostMutation>;
export type HidePostMutationResult = Apollo.MutationResult<HidePostMutation>;
export type HidePostMutationOptions = Apollo.BaseMutationOptions<HidePostMutation, HidePostMutationVariables>;
export const IncrementPostViewDocument = gql`
    mutation IncrementPostView($postId: String!) {
  incrementPostView(postId: $postId) {
    id
  }
}
    `;
export type IncrementPostViewMutationFn = Apollo.MutationFunction<IncrementPostViewMutation, IncrementPostViewMutationVariables>;

/**
 * __useIncrementPostViewMutation__
 *
 * To run a mutation, you first call `useIncrementPostViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncrementPostViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [incrementPostViewMutation, { data, loading, error }] = useIncrementPostViewMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useIncrementPostViewMutation(baseOptions?: Apollo.MutationHookOptions<IncrementPostViewMutation, IncrementPostViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IncrementPostViewMutation, IncrementPostViewMutationVariables>(IncrementPostViewDocument, options);
      }
export type IncrementPostViewMutationHookResult = ReturnType<typeof useIncrementPostViewMutation>;
export type IncrementPostViewMutationResult = Apollo.MutationResult<IncrementPostViewMutation>;
export type IncrementPostViewMutationOptions = Apollo.BaseMutationOptions<IncrementPostViewMutation, IncrementPostViewMutationVariables>;
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
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    address
    username
    displayName
    xpBalance
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    address
    username
    displayName
    bio
    xpBalance
    updatedAt
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetIsBookmarkedDocument = gql`
    query GetIsBookmarked($postId: String!) {
  getIsBookmarked(postId: $postId)
}
    `;

/**
 * __useGetIsBookmarkedQuery__
 *
 * To run a query within a React component, call `useGetIsBookmarkedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsBookmarkedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsBookmarkedQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetIsBookmarkedQuery(baseOptions: Apollo.QueryHookOptions<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables> & ({ variables: GetIsBookmarkedQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>(GetIsBookmarkedDocument, options);
      }
export function useGetIsBookmarkedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>(GetIsBookmarkedDocument, options);
        }
export function useGetIsBookmarkedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>(GetIsBookmarkedDocument, options);
        }
export type GetIsBookmarkedQueryHookResult = ReturnType<typeof useGetIsBookmarkedQuery>;
export type GetIsBookmarkedLazyQueryHookResult = ReturnType<typeof useGetIsBookmarkedLazyQuery>;
export type GetIsBookmarkedSuspenseQueryHookResult = ReturnType<typeof useGetIsBookmarkedSuspenseQuery>;
export type GetIsBookmarkedQueryResult = Apollo.QueryResult<GetIsBookmarkedQuery, GetIsBookmarkedQueryVariables>;
export const GetCommentsByPostDocument = gql`
    query GetCommentsByPost($postId: String!, $limit: Int) {
  getCommentsByPost(postId: $postId, limit: $limit) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    content
    id
    createdAt
    likeCount
    repliesCount
    parentComment {
      content
      id
    }
    post {
      id
      title
    }
    updatedAt
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
    query GetRepliesByComment($commentId: String!, $limit: Int) {
  getRepliesByComment(commentId: $commentId, limit: $limit) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    content
    id
    createdAt
    likeCount
    repliesCount
    parentComment {
      content
      id
    }
    post {
      id
      title
    }
    updatedAt
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
export const GetActiveUsersDocument = gql`
    query GetActiveUsers($limit: Int) {
  getActiveUsers(limit: $limit) {
    address
    bio
    bookmarksCount
    coverPicture
    createdAt
    displayName
    followersCount
    followingCount
    profilePicture
    publicationsCount
    socialLinks {
      url
      platform
    }
    updatedAt
    username
    verified
    xpBalance
  }
}
    `;

/**
 * __useGetActiveUsersQuery__
 *
 * To run a query within a React component, call `useGetActiveUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetActiveUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
      }
export function useGetActiveUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
        }
export function useGetActiveUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
        }
export type GetActiveUsersQueryHookResult = ReturnType<typeof useGetActiveUsersQuery>;
export type GetActiveUsersLazyQueryHookResult = ReturnType<typeof useGetActiveUsersLazyQuery>;
export type GetActiveUsersSuspenseQueryHookResult = ReturnType<typeof useGetActiveUsersSuspenseQuery>;
export type GetActiveUsersQueryResult = Apollo.QueryResult<GetActiveUsersQuery, GetActiveUsersQueryVariables>;
export const GetAllPostsDocument = gql`
    query GetAllPosts($limit: Int) {
  getAllPosts(limit: $limit) {
    id
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    media {
      id
      type
      url
      title
      cid
    }
    visibility
    commentCount
    likeCount
    bookmarkCount
    viewCount
    updatedAt
    createdAt
    cid
    description
    title
  }
}
    `;

/**
 * __useGetAllPostsQuery__
 *
 * To run a query within a React component, call `useGetAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetAllPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
      }
export function useGetAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
        }
export function useGetAllPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
        }
export type GetAllPostsQueryHookResult = ReturnType<typeof useGetAllPostsQuery>;
export type GetAllPostsLazyQueryHookResult = ReturnType<typeof useGetAllPostsLazyQuery>;
export type GetAllPostsSuspenseQueryHookResult = ReturnType<typeof useGetAllPostsSuspenseQuery>;
export type GetAllPostsQueryResult = Apollo.QueryResult<GetAllPostsQuery, GetAllPostsQueryVariables>;
export const GetPopularPostsDocument = gql`
    query GetPopularPosts($limit: Int) {
  getPopularPosts(limit: $limit) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    bookmarkCount
    cid
    commentCount
    createdAt
    description
    id
    likeCount
    media {
      url
      type
      title
      id
      cid
    }
    title
    updatedAt
    visibility
    viewCount
  }
}
    `;

/**
 * __useGetPopularPostsQuery__
 *
 * To run a query within a React component, call `useGetPopularPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularPostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPopularPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPopularPostsQuery, GetPopularPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPopularPostsQuery, GetPopularPostsQueryVariables>(GetPopularPostsDocument, options);
      }
export function useGetPopularPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularPostsQuery, GetPopularPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPopularPostsQuery, GetPopularPostsQueryVariables>(GetPopularPostsDocument, options);
        }
export function useGetPopularPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPopularPostsQuery, GetPopularPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPopularPostsQuery, GetPopularPostsQueryVariables>(GetPopularPostsDocument, options);
        }
export type GetPopularPostsQueryHookResult = ReturnType<typeof useGetPopularPostsQuery>;
export type GetPopularPostsLazyQueryHookResult = ReturnType<typeof useGetPopularPostsLazyQuery>;
export type GetPopularPostsSuspenseQueryHookResult = ReturnType<typeof useGetPopularPostsSuspenseQuery>;
export type GetPopularPostsQueryResult = Apollo.QueryResult<GetPopularPostsQuery, GetPopularPostsQueryVariables>;
export const GetPopularUsersDocument = gql`
    query GetPopularUsers($limit: Int) {
  getPopularUsers(limit: $limit) {
    address
    bio
    bookmarksCount
    coverPicture
    createdAt
    displayName
    followersCount
    followingCount
    profilePicture
    publicationsCount
    socialLinks {
      url
      platform
    }
    updatedAt
    username
    verified
    xpBalance
  }
}
    `;

/**
 * __useGetPopularUsersQuery__
 *
 * To run a query within a React component, call `useGetPopularUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPopularUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetPopularUsersQuery, GetPopularUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPopularUsersQuery, GetPopularUsersQueryVariables>(GetPopularUsersDocument, options);
      }
export function useGetPopularUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularUsersQuery, GetPopularUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPopularUsersQuery, GetPopularUsersQueryVariables>(GetPopularUsersDocument, options);
        }
export function useGetPopularUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPopularUsersQuery, GetPopularUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPopularUsersQuery, GetPopularUsersQueryVariables>(GetPopularUsersDocument, options);
        }
export type GetPopularUsersQueryHookResult = ReturnType<typeof useGetPopularUsersQuery>;
export type GetPopularUsersLazyQueryHookResult = ReturnType<typeof useGetPopularUsersLazyQuery>;
export type GetPopularUsersSuspenseQueryHookResult = ReturnType<typeof useGetPopularUsersSuspenseQuery>;
export type GetPopularUsersQueryResult = Apollo.QueryResult<GetPopularUsersQuery, GetPopularUsersQueryVariables>;
export const GetRecentPostsDocument = gql`
    query GetRecentPosts($limit: Int) {
  getRecentPosts(limit: $limit) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    bookmarkCount
    cid
    commentCount
    createdAt
    description
    id
    likeCount
    media {
      url
      type
      title
      id
      cid
    }
    title
    updatedAt
    visibility
    viewCount
  }
}
    `;

/**
 * __useGetRecentPostsQuery__
 *
 * To run a query within a React component, call `useGetRecentPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentPostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetRecentPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetRecentPostsQuery, GetRecentPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecentPostsQuery, GetRecentPostsQueryVariables>(GetRecentPostsDocument, options);
      }
export function useGetRecentPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentPostsQuery, GetRecentPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecentPostsQuery, GetRecentPostsQueryVariables>(GetRecentPostsDocument, options);
        }
export function useGetRecentPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentPostsQuery, GetRecentPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecentPostsQuery, GetRecentPostsQueryVariables>(GetRecentPostsDocument, options);
        }
export type GetRecentPostsQueryHookResult = ReturnType<typeof useGetRecentPostsQuery>;
export type GetRecentPostsLazyQueryHookResult = ReturnType<typeof useGetRecentPostsLazyQuery>;
export type GetRecentPostsSuspenseQueryHookResult = ReturnType<typeof useGetRecentPostsSuspenseQuery>;
export type GetRecentPostsQueryResult = Apollo.QueryResult<GetRecentPostsQuery, GetRecentPostsQueryVariables>;
export const GetRecentUsersDocument = gql`
    query GetRecentUsers($limit: Int) {
  getRecentUsers(limit: $limit) {
    address
    bio
    bookmarksCount
    coverPicture
    createdAt
    displayName
    followersCount
    followingCount
    profilePicture
    publicationsCount
    socialLinks {
      platform
      url
    }
    updatedAt
    username
    verified
    xpBalance
  }
}
    `;

/**
 * __useGetRecentUsersQuery__
 *
 * To run a query within a React component, call `useGetRecentUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetRecentUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetRecentUsersQuery, GetRecentUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecentUsersQuery, GetRecentUsersQueryVariables>(GetRecentUsersDocument, options);
      }
export function useGetRecentUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentUsersQuery, GetRecentUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecentUsersQuery, GetRecentUsersQueryVariables>(GetRecentUsersDocument, options);
        }
export function useGetRecentUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentUsersQuery, GetRecentUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecentUsersQuery, GetRecentUsersQueryVariables>(GetRecentUsersDocument, options);
        }
export type GetRecentUsersQueryHookResult = ReturnType<typeof useGetRecentUsersQuery>;
export type GetRecentUsersLazyQueryHookResult = ReturnType<typeof useGetRecentUsersLazyQuery>;
export type GetRecentUsersSuspenseQueryHookResult = ReturnType<typeof useGetRecentUsersSuspenseQuery>;
export type GetRecentUsersQueryResult = Apollo.QueryResult<GetRecentUsersQuery, GetRecentUsersQueryVariables>;
export const GetIsFollowingDocument = gql`
    query GetIsFollowing($targetAddress: String!) {
  getIsFollowing(targetAddress: $targetAddress)
}
    `;

/**
 * __useGetIsFollowingQuery__
 *
 * To run a query within a React component, call `useGetIsFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsFollowingQuery({
 *   variables: {
 *      targetAddress: // value for 'targetAddress'
 *   },
 * });
 */
export function useGetIsFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetIsFollowingQuery, GetIsFollowingQueryVariables> & ({ variables: GetIsFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsFollowingQuery, GetIsFollowingQueryVariables>(GetIsFollowingDocument, options);
      }
export function useGetIsFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsFollowingQuery, GetIsFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsFollowingQuery, GetIsFollowingQueryVariables>(GetIsFollowingDocument, options);
        }
export function useGetIsFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIsFollowingQuery, GetIsFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIsFollowingQuery, GetIsFollowingQueryVariables>(GetIsFollowingDocument, options);
        }
export type GetIsFollowingQueryHookResult = ReturnType<typeof useGetIsFollowingQuery>;
export type GetIsFollowingLazyQueryHookResult = ReturnType<typeof useGetIsFollowingLazyQuery>;
export type GetIsFollowingSuspenseQueryHookResult = ReturnType<typeof useGetIsFollowingSuspenseQuery>;
export type GetIsFollowingQueryResult = Apollo.QueryResult<GetIsFollowingQuery, GetIsFollowingQueryVariables>;
export const GetLeaderboardDocument = gql`
    query GetLeaderboard($limit: Int) {
  getLeaderboard(limit: $limit) {
    address
    email
    xpTotal
    xpBalance
    username
    displayName
    currentRank
    profilePicture
  }
}
    `;

/**
 * __useGetLeaderboardQuery__
 *
 * To run a query within a React component, call `useGetLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaderboardQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetLeaderboardQuery(baseOptions?: Apollo.QueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, options);
      }
export function useGetLeaderboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, options);
        }
export function useGetLeaderboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, options);
        }
export type GetLeaderboardQueryHookResult = ReturnType<typeof useGetLeaderboardQuery>;
export type GetLeaderboardLazyQueryHookResult = ReturnType<typeof useGetLeaderboardLazyQuery>;
export type GetLeaderboardSuspenseQueryHookResult = ReturnType<typeof useGetLeaderboardSuspenseQuery>;
export type GetLeaderboardQueryResult = Apollo.QueryResult<GetLeaderboardQuery, GetLeaderboardQueryVariables>;
export const GetIsLikedDocument = gql`
    query GetIsLiked($targetId: String!) {
  getIsLiked(targetId: $targetId)
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
export const GetPostViewsDocument = gql`
    query GetPostViews($postId: String!) {
  getPostViews(postId: $postId)
}
    `;

/**
 * __useGetPostViewsQuery__
 *
 * To run a query within a React component, call `useGetPostViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostViewsQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetPostViewsQuery(baseOptions: Apollo.QueryHookOptions<GetPostViewsQuery, GetPostViewsQueryVariables> & ({ variables: GetPostViewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostViewsQuery, GetPostViewsQueryVariables>(GetPostViewsDocument, options);
      }
export function useGetPostViewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostViewsQuery, GetPostViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostViewsQuery, GetPostViewsQueryVariables>(GetPostViewsDocument, options);
        }
export function useGetPostViewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostViewsQuery, GetPostViewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostViewsQuery, GetPostViewsQueryVariables>(GetPostViewsDocument, options);
        }
export type GetPostViewsQueryHookResult = ReturnType<typeof useGetPostViewsQuery>;
export type GetPostViewsLazyQueryHookResult = ReturnType<typeof useGetPostViewsLazyQuery>;
export type GetPostViewsSuspenseQueryHookResult = ReturnType<typeof useGetPostViewsSuspenseQuery>;
export type GetPostViewsQueryResult = Apollo.QueryResult<GetPostViewsQuery, GetPostViewsQueryVariables>;
export const GetProfileViewsDocument = gql`
    query GetProfileViews($address: String!) {
  getProfileViews(address: $address)
}
    `;

/**
 * __useGetProfileViewsQuery__
 *
 * To run a query within a React component, call `useGetProfileViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileViewsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetProfileViewsQuery(baseOptions: Apollo.QueryHookOptions<GetProfileViewsQuery, GetProfileViewsQueryVariables> & ({ variables: GetProfileViewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileViewsQuery, GetProfileViewsQueryVariables>(GetProfileViewsDocument, options);
      }
export function useGetProfileViewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileViewsQuery, GetProfileViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileViewsQuery, GetProfileViewsQueryVariables>(GetProfileViewsDocument, options);
        }
export function useGetProfileViewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileViewsQuery, GetProfileViewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileViewsQuery, GetProfileViewsQueryVariables>(GetProfileViewsDocument, options);
        }
export type GetProfileViewsQueryHookResult = ReturnType<typeof useGetProfileViewsQuery>;
export type GetProfileViewsLazyQueryHookResult = ReturnType<typeof useGetProfileViewsLazyQuery>;
export type GetProfileViewsSuspenseQueryHookResult = ReturnType<typeof useGetProfileViewsSuspenseQuery>;
export type GetProfileViewsQueryResult = Apollo.QueryResult<GetProfileViewsQuery, GetProfileViewsQueryVariables>;
export const GetTargetEventsDocument = gql`
    query GetTargetEvents($targetId: String!, $targetType: String, $type: String, $limit: Int, $offset: Int) {
  getTargetEvents(
    targetId: $targetId
    targetType: $targetType
    type: $type
    limit: $limit
    offset: $offset
  ) {
    id
    type
    author
    targetId
    targetType
    progress
    amount
    currency
    meta
    createdAt
  }
}
    `;

/**
 * __useGetTargetEventsQuery__
 *
 * To run a query within a React component, call `useGetTargetEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTargetEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTargetEventsQuery({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      targetType: // value for 'targetType'
 *      type: // value for 'type'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetTargetEventsQuery(baseOptions: Apollo.QueryHookOptions<GetTargetEventsQuery, GetTargetEventsQueryVariables> & ({ variables: GetTargetEventsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTargetEventsQuery, GetTargetEventsQueryVariables>(GetTargetEventsDocument, options);
      }
export function useGetTargetEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTargetEventsQuery, GetTargetEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTargetEventsQuery, GetTargetEventsQueryVariables>(GetTargetEventsDocument, options);
        }
export function useGetTargetEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTargetEventsQuery, GetTargetEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTargetEventsQuery, GetTargetEventsQueryVariables>(GetTargetEventsDocument, options);
        }
export type GetTargetEventsQueryHookResult = ReturnType<typeof useGetTargetEventsQuery>;
export type GetTargetEventsLazyQueryHookResult = ReturnType<typeof useGetTargetEventsLazyQuery>;
export type GetTargetEventsSuspenseQueryHookResult = ReturnType<typeof useGetTargetEventsSuspenseQuery>;
export type GetTargetEventsQueryResult = Apollo.QueryResult<GetTargetEventsQuery, GetTargetEventsQueryVariables>;
export const GetUserEventsDocument = gql`
    query GetUserEvents($address: String!, $type: String, $limit: Int, $offset: Int) {
  getUserEvents(address: $address, type: $type, limit: $limit, offset: $offset) {
    amount
    author
    createdAt
    currency
    id
    meta
    progress
    targetId
    targetType
    type
  }
}
    `;

/**
 * __useGetUserEventsQuery__
 *
 * To run a query within a React component, call `useGetUserEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserEventsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      type: // value for 'type'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUserEventsQuery(baseOptions: Apollo.QueryHookOptions<GetUserEventsQuery, GetUserEventsQueryVariables> & ({ variables: GetUserEventsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserEventsQuery, GetUserEventsQueryVariables>(GetUserEventsDocument, options);
      }
export function useGetUserEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserEventsQuery, GetUserEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserEventsQuery, GetUserEventsQueryVariables>(GetUserEventsDocument, options);
        }
export function useGetUserEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserEventsQuery, GetUserEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserEventsQuery, GetUserEventsQueryVariables>(GetUserEventsDocument, options);
        }
export type GetUserEventsQueryHookResult = ReturnType<typeof useGetUserEventsQuery>;
export type GetUserEventsLazyQueryHookResult = ReturnType<typeof useGetUserEventsLazyQuery>;
export type GetUserEventsSuspenseQueryHookResult = ReturnType<typeof useGetUserEventsSuspenseQuery>;
export type GetUserEventsQueryResult = Apollo.QueryResult<GetUserEventsQuery, GetUserEventsQueryVariables>;
export const HasPerkDocument = gql`
    query HasPerk($address: String!, $perkId: ID!) {
  hasPerk(address: $address, perkId: $perkId)
}
    `;

/**
 * __useHasPerkQuery__
 *
 * To run a query within a React component, call `useHasPerkQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasPerkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasPerkQuery({
 *   variables: {
 *      address: // value for 'address'
 *      perkId: // value for 'perkId'
 *   },
 * });
 */
export function useHasPerkQuery(baseOptions: Apollo.QueryHookOptions<HasPerkQuery, HasPerkQueryVariables> & ({ variables: HasPerkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HasPerkQuery, HasPerkQueryVariables>(HasPerkDocument, options);
      }
export function useHasPerkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HasPerkQuery, HasPerkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HasPerkQuery, HasPerkQueryVariables>(HasPerkDocument, options);
        }
export function useHasPerkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HasPerkQuery, HasPerkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HasPerkQuery, HasPerkQueryVariables>(HasPerkDocument, options);
        }
export type HasPerkQueryHookResult = ReturnType<typeof useHasPerkQuery>;
export type HasPerkLazyQueryHookResult = ReturnType<typeof useHasPerkLazyQuery>;
export type HasPerkSuspenseQueryHookResult = ReturnType<typeof useHasPerkSuspenseQuery>;
export type HasPerkQueryResult = Apollo.QueryResult<HasPerkQuery, HasPerkQueryVariables>;
export const GetPerksDocument = gql`
    query GetPerks {
  getPerks {
    availableAt
    category
    collectedAt
    cooldownRemaining
    enabled
    executionRule {
      cooldownSec
      type
    }
    id
    minRankId
    name
    reward {
      action
      amount
      tokenId
    }
    rewardPreview
    uiHint
    unlockRule {
      action
      on
      rankId
      times
      window
    }
  }
}
    `;

/**
 * __useGetPerksQuery__
 *
 * To run a query within a React component, call `useGetPerksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPerksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPerksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPerksQuery(baseOptions?: Apollo.QueryHookOptions<GetPerksQuery, GetPerksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPerksQuery, GetPerksQueryVariables>(GetPerksDocument, options);
      }
export function useGetPerksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPerksQuery, GetPerksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPerksQuery, GetPerksQueryVariables>(GetPerksDocument, options);
        }
export function useGetPerksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPerksQuery, GetPerksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPerksQuery, GetPerksQueryVariables>(GetPerksDocument, options);
        }
export type GetPerksQueryHookResult = ReturnType<typeof useGetPerksQuery>;
export type GetPerksLazyQueryHookResult = ReturnType<typeof useGetPerksLazyQuery>;
export type GetPerksSuspenseQueryHookResult = ReturnType<typeof useGetPerksSuspenseQuery>;
export type GetPerksQueryResult = Apollo.QueryResult<GetPerksQuery, GetPerksQueryVariables>;
export const GetUnlockedPerksDocument = gql`
    query GetUnlockedPerks($address: String!) {
  getUnlockedPerks(address: $address) {
    availableAt
    collectedAt
    cooldownSec
    createdAt
    id
    perk {
      id
      name
      minRankId
      uiHint
      category
      collectedAt
      availableAt
      cooldownRemaining
      rewardPreview
      unlockRule {
        action
        on
        rankId
        times
        window
      }
      executionRule {
        cooldownSec
        type
      }
      reward {
        action
        amount
        tokenId
      }
      enabled
    }
    perkId
    progress
    status
    target
    user
  }
}
    `;

/**
 * __useGetUnlockedPerksQuery__
 *
 * To run a query within a React component, call `useGetUnlockedPerksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnlockedPerksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnlockedPerksQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetUnlockedPerksQuery(baseOptions: Apollo.QueryHookOptions<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables> & ({ variables: GetUnlockedPerksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>(GetUnlockedPerksDocument, options);
      }
export function useGetUnlockedPerksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>(GetUnlockedPerksDocument, options);
        }
export function useGetUnlockedPerksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>(GetUnlockedPerksDocument, options);
        }
export type GetUnlockedPerksQueryHookResult = ReturnType<typeof useGetUnlockedPerksQuery>;
export type GetUnlockedPerksLazyQueryHookResult = ReturnType<typeof useGetUnlockedPerksLazyQuery>;
export type GetUnlockedPerksSuspenseQueryHookResult = ReturnType<typeof useGetUnlockedPerksSuspenseQuery>;
export type GetUnlockedPerksQueryResult = Apollo.QueryResult<GetUnlockedPerksQuery, GetUnlockedPerksQueryVariables>;
export const GetPostDocument = gql`
    query GetPost($getPostId: String!) {
  getPost(id: $getPostId) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    bookmarkCount
    cid
    commentCount
    createdAt
    description
    id
    likeCount
    media {
      cid
      id
      title
      type
      url
    }
    title
    updatedAt
    viewCount
    visibility
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
 *      getPostId: // value for 'getPostId'
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
export const GetPostsByAuthorDocument = gql`
    query GetPostsByAuthor($author: String!, $limit: Int) {
  getPostsByAuthor(author: $author, limit: $limit) {
    visibility
    viewCount
    updatedAt
    media {
      id
      type
      title
      cid
      url
    }
    likeCount
    id
    createdAt
    commentCount
    bookmarkCount
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    cid
    description
    title
  }
}
    `;

/**
 * __useGetPostsByAuthorQuery__
 *
 * To run a query within a React component, call `useGetPostsByAuthorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsByAuthorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsByAuthorQuery({
 *   variables: {
 *      author: // value for 'author'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPostsByAuthorQuery(baseOptions: Apollo.QueryHookOptions<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables> & ({ variables: GetPostsByAuthorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>(GetPostsByAuthorDocument, options);
      }
export function useGetPostsByAuthorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>(GetPostsByAuthorDocument, options);
        }
export function useGetPostsByAuthorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>(GetPostsByAuthorDocument, options);
        }
export type GetPostsByAuthorQueryHookResult = ReturnType<typeof useGetPostsByAuthorQuery>;
export type GetPostsByAuthorLazyQueryHookResult = ReturnType<typeof useGetPostsByAuthorLazyQuery>;
export type GetPostsByAuthorSuspenseQueryHookResult = ReturnType<typeof useGetPostsByAuthorSuspenseQuery>;
export type GetPostsByAuthorQueryResult = Apollo.QueryResult<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts($query: String!, $limit: Int) {
  getPosts(query: $query, limit: $limit) {
    author {
      address
      displayName
      followersCount
      followingCount
      coverPicture
      profilePicture
      bio
      publicationsCount
      username
    }
    bookmarkCount
    cid
    commentCount
    createdAt
    description
    id
    likeCount
    media {
      url
      type
      title
      id
      cid
    }
    title
    updatedAt
    viewCount
    visibility
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
 *      query: // value for 'query'
 *      limit: // value for 'limit'
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
export const GetAchievementsDocument = gql`
    query GetAchievements($address: String!) {
  getAchievements(address: $address) {
    currentRank {
      badgeUrl
      colorTheme
      createdAt
      id
      minXp
      name
      order
      updatedAt
    }
    nextRank {
      name
      minXp
      id
      createdAt
      colorTheme
      badgeUrl
      order
      updatedAt
    }
    progressPct
    xpBalance
    xpRemaining
    xpTotal
  }
}
    `;

/**
 * __useGetAchievementsQuery__
 *
 * To run a query within a React component, call `useGetAchievementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAchievementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAchievementsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetAchievementsQuery(baseOptions: Apollo.QueryHookOptions<GetAchievementsQuery, GetAchievementsQueryVariables> & ({ variables: GetAchievementsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAchievementsQuery, GetAchievementsQueryVariables>(GetAchievementsDocument, options);
      }
export function useGetAchievementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAchievementsQuery, GetAchievementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAchievementsQuery, GetAchievementsQueryVariables>(GetAchievementsDocument, options);
        }
export function useGetAchievementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAchievementsQuery, GetAchievementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAchievementsQuery, GetAchievementsQueryVariables>(GetAchievementsDocument, options);
        }
export type GetAchievementsQueryHookResult = ReturnType<typeof useGetAchievementsQuery>;
export type GetAchievementsLazyQueryHookResult = ReturnType<typeof useGetAchievementsLazyQuery>;
export type GetAchievementsSuspenseQueryHookResult = ReturnType<typeof useGetAchievementsSuspenseQuery>;
export type GetAchievementsQueryResult = Apollo.QueryResult<GetAchievementsQuery, GetAchievementsQueryVariables>;
export const GetRanksCatalogDocument = gql`
    query GetRanksCatalog {
  getRanksCatalog {
    badgeUrl
    colorTheme
    createdAt
    id
    minXp
    name
    updatedAt
    order
  }
}
    `;

/**
 * __useGetRanksCatalogQuery__
 *
 * To run a query within a React component, call `useGetRanksCatalogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRanksCatalogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRanksCatalogQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRanksCatalogQuery(baseOptions?: Apollo.QueryHookOptions<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>(GetRanksCatalogDocument, options);
      }
export function useGetRanksCatalogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>(GetRanksCatalogDocument, options);
        }
export function useGetRanksCatalogSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>(GetRanksCatalogDocument, options);
        }
export type GetRanksCatalogQueryHookResult = ReturnType<typeof useGetRanksCatalogQuery>;
export type GetRanksCatalogLazyQueryHookResult = ReturnType<typeof useGetRanksCatalogLazyQuery>;
export type GetRanksCatalogSuspenseQueryHookResult = ReturnType<typeof useGetRanksCatalogSuspenseQuery>;
export type GetRanksCatalogQueryResult = Apollo.QueryResult<GetRanksCatalogQuery, GetRanksCatalogQueryVariables>;
export const GetUserRanksDocument = gql`
    query GetUserRanks($address: String!) {
  getUserRanks(address: $address) {
    achievedAt
    rankId
    user
  }
}
    `;

/**
 * __useGetUserRanksQuery__
 *
 * To run a query within a React component, call `useGetUserRanksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRanksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRanksQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetUserRanksQuery(baseOptions: Apollo.QueryHookOptions<GetUserRanksQuery, GetUserRanksQueryVariables> & ({ variables: GetUserRanksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserRanksQuery, GetUserRanksQueryVariables>(GetUserRanksDocument, options);
      }
export function useGetUserRanksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserRanksQuery, GetUserRanksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserRanksQuery, GetUserRanksQueryVariables>(GetUserRanksDocument, options);
        }
export function useGetUserRanksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserRanksQuery, GetUserRanksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserRanksQuery, GetUserRanksQueryVariables>(GetUserRanksDocument, options);
        }
export type GetUserRanksQueryHookResult = ReturnType<typeof useGetUserRanksQuery>;
export type GetUserRanksLazyQueryHookResult = ReturnType<typeof useGetUserRanksLazyQuery>;
export type GetUserRanksSuspenseQueryHookResult = ReturnType<typeof useGetUserRanksSuspenseQuery>;
export type GetUserRanksQueryResult = Apollo.QueryResult<GetUserRanksQuery, GetUserRanksQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($input: UserByInput!) {
  getUser(input: $input) {
    address
    username
    displayName
    bio
    profilePicture
    coverPicture
    currentRank
    xpTotal
    xpBalance
    followersCount
    followingCount
    publicationsCount
    bookmarksCount
    socialLinks {
      platform
      url
    }
    verified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUserBookmarksDocument = gql`
    query GetUserBookmarks($address: String!, $limit: Int) {
  getUserBookmarks(address: $address, limit: $limit) {
    id
    title
    description
    likeCount
    media {
      url
      cid
      title
      type
    }
    createdAt
  }
}
    `;

/**
 * __useGetUserBookmarksQuery__
 *
 * To run a query within a React component, call `useGetUserBookmarksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserBookmarksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserBookmarksQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUserBookmarksQuery(baseOptions: Apollo.QueryHookOptions<GetUserBookmarksQuery, GetUserBookmarksQueryVariables> & ({ variables: GetUserBookmarksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>(GetUserBookmarksDocument, options);
      }
export function useGetUserBookmarksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>(GetUserBookmarksDocument, options);
        }
export function useGetUserBookmarksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>(GetUserBookmarksDocument, options);
        }
export type GetUserBookmarksQueryHookResult = ReturnType<typeof useGetUserBookmarksQuery>;
export type GetUserBookmarksLazyQueryHookResult = ReturnType<typeof useGetUserBookmarksLazyQuery>;
export type GetUserBookmarksSuspenseQueryHookResult = ReturnType<typeof useGetUserBookmarksSuspenseQuery>;
export type GetUserBookmarksQueryResult = Apollo.QueryResult<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>;
export const GetUserFollowersDocument = gql`
    query GetUserFollowers($address: String!, $limit: Int) {
  getUserFollowers(address: $address, limit: $limit) {
    address
    username
    displayName
    bio
    profilePicture
    coverPicture
    xpBalance
    followersCount
    followingCount
    publicationsCount
    bookmarksCount
    socialLinks {
      platform
      url
    }
    verified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserFollowersQuery__
 *
 * To run a query within a React component, call `useGetUserFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFollowersQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUserFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetUserFollowersQuery, GetUserFollowersQueryVariables> & ({ variables: GetUserFollowersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFollowersQuery, GetUserFollowersQueryVariables>(GetUserFollowersDocument, options);
      }
export function useGetUserFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFollowersQuery, GetUserFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFollowersQuery, GetUserFollowersQueryVariables>(GetUserFollowersDocument, options);
        }
export function useGetUserFollowersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserFollowersQuery, GetUserFollowersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserFollowersQuery, GetUserFollowersQueryVariables>(GetUserFollowersDocument, options);
        }
export type GetUserFollowersQueryHookResult = ReturnType<typeof useGetUserFollowersQuery>;
export type GetUserFollowersLazyQueryHookResult = ReturnType<typeof useGetUserFollowersLazyQuery>;
export type GetUserFollowersSuspenseQueryHookResult = ReturnType<typeof useGetUserFollowersSuspenseQuery>;
export type GetUserFollowersQueryResult = Apollo.QueryResult<GetUserFollowersQuery, GetUserFollowersQueryVariables>;
export const GetUserFollowingDocument = gql`
    query GetUserFollowing($address: String!, $limit: Int) {
  getUserFollowing(address: $address, limit: $limit) {
    address
    username
    displayName
    bio
    profilePicture
    coverPicture
    xpBalance
    followersCount
    followingCount
    publicationsCount
    bookmarksCount
    socialLinks {
      platform
      url
    }
    verified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserFollowingQuery__
 *
 * To run a query within a React component, call `useGetUserFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFollowingQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetUserFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetUserFollowingQuery, GetUserFollowingQueryVariables> & ({ variables: GetUserFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFollowingQuery, GetUserFollowingQueryVariables>(GetUserFollowingDocument, options);
      }
export function useGetUserFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFollowingQuery, GetUserFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFollowingQuery, GetUserFollowingQueryVariables>(GetUserFollowingDocument, options);
        }
export function useGetUserFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserFollowingQuery, GetUserFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserFollowingQuery, GetUserFollowingQueryVariables>(GetUserFollowingDocument, options);
        }
export type GetUserFollowingQueryHookResult = ReturnType<typeof useGetUserFollowingQuery>;
export type GetUserFollowingLazyQueryHookResult = ReturnType<typeof useGetUserFollowingLazyQuery>;
export type GetUserFollowingSuspenseQueryHookResult = ReturnType<typeof useGetUserFollowingSuspenseQuery>;
export type GetUserFollowingQueryResult = Apollo.QueryResult<GetUserFollowingQuery, GetUserFollowingQueryVariables>;
export const GetUserXpHistoryDocument = gql`
    query GetUserXPHistory($address: String!, $limit: Int = 50, $offset: Int = 0) {
  getUserXPHistory(address: $address, limit: $limit, offset: $offset) {
    id
    action
    description
    amount
    balanceBefore
    balanceAfter
    createdAt
  }
}
    `;

/**
 * __useGetUserXpHistoryQuery__
 *
 * To run a query within a React component, call `useGetUserXpHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserXpHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserXpHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUserXpHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables> & ({ variables: GetUserXpHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>(GetUserXpHistoryDocument, options);
      }
export function useGetUserXpHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>(GetUserXpHistoryDocument, options);
        }
export function useGetUserXpHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>(GetUserXpHistoryDocument, options);
        }
export type GetUserXpHistoryQueryHookResult = ReturnType<typeof useGetUserXpHistoryQuery>;
export type GetUserXpHistoryLazyQueryHookResult = ReturnType<typeof useGetUserXpHistoryLazyQuery>;
export type GetUserXpHistorySuspenseQueryHookResult = ReturnType<typeof useGetUserXpHistorySuspenseQuery>;
export type GetUserXpHistoryQueryResult = Apollo.QueryResult<GetUserXpHistoryQuery, GetUserXpHistoryQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($limit: Int, $query: String!) {
  getUsers(limit: $limit, query: $query) {
    address
    displayName
    bio
    coverPicture
    username
    profilePicture
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables> & ({ variables: GetUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;