import { gql, QueryHookOptions, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import type {
  Comment,
  CommentsFilterInput,
  CreateCommentInput,
  PaginationInput,
} from '@src/graphql/generated/graphql';

// TODO: Replace temporary definitions when codegen is updated for the new schema.

const GET_COMMENTS = gql`
  query GetComments($input: CommentsFilterInput!, $page: PaginationInput) {
    getComments(input: $input, page: $page) {
      id
      body
      parent {
        id
        body
        base {
          id
          user {
            id
            address
            displayName
            profile {
              username
              picture
            }
          }
        }
      }
      replies {
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
          email
          verified
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

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      body
      parent {
        id
        body
        base {
          id
          user {
            id
            address
            displayName
            profile {
              username
              picture
            }
          }
        }
      }
      replies {
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
          email
          verified
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

type GetCommentsQueryData = {
  getComments: Comment[];
};

type GetCommentsQueryVars = {
  input: CommentsFilterInput;
  page?: PaginationInput | null;
};

export function useGetCommentsQuery(
  options: QueryHookOptions<GetCommentsQueryData, GetCommentsQueryVars>
) {
  return useQuery<GetCommentsQueryData, GetCommentsQueryVars>(GET_COMMENTS, options);
}

export function useGetCommentsLazyQuery() {
  return useLazyQuery<GetCommentsQueryData, GetCommentsQueryVars>(GET_COMMENTS);
}

export function useCreateCommentMutation() {
  return useMutation<{ createComment: Comment }, { input: CreateCommentInput }>(CREATE_COMMENT);
}
