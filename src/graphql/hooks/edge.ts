import { gql, useLazyQuery, useMutation } from '@apollo/client';
import type { Edge, EdgeByIdentifierInput, SetEdgeStatusInput } from '@src/graphql/generated/graphql';

// TODO: Replace stubbed selections when codegen is updated for the new schema.

const GET_EDGE_STATUS = gql`
  query GetEdgeStatus($input: EdgeByIdentifierInput!) {
    getEdgeStatus(input: $input) {
      isFollowing
      isBlocked
      followedAt
      user {
        id
        address
        displayName
        verified
        profile {
          username
          picture
          cover
        }
        socials {
          platform
          url
        }
      }
    }
  }
`;

const SET_EDGE_STATUS = gql`
  mutation SetEdgeStatus($input: SetEdgeStatusInput!) {
    setEdgeStatus(input: $input) {
      isFollowing
      isBlocked
      followedAt
      user {
        id
        address
        displayName
        verified
        profile {
          username
          picture
          cover
        }
        socials {
          platform
          url
        }
      }
    }
  }
`;

export function useGetEdgeStatusLazyQuery() {
  return useLazyQuery<{ getEdgeStatus?: Edge | null }, { input: EdgeByIdentifierInput }>(
    GET_EDGE_STATUS
  );
}

export function useSetEdgeStatusMutation() {
  return useMutation<{ setEdgeStatus: Edge }, { input: SetEdgeStatusInput }>(SET_EDGE_STATUS);
}
