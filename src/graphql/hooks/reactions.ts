import { gql, useLazyQuery, useMutation } from '@apollo/client';

type ToggleLikeInput = {
  targetId: number;
  targetType?: 'POST' | 'COMMENT';
};

type ToggleLikeResponse = {
  toggleLike: boolean;
};

type GetIsLikedResponse = {
  getIsLiked: boolean;
};

type GetIsLikedVariables = {
  targetId: number;
  targetType?: 'POST' | 'COMMENT';
};

const GET_IS_LIKED = gql`
  query GetIsLiked($targetId: Int!, $targetType: ReactionTargetType = POST) {
    getIsLiked(targetId: $targetId, targetType: $targetType)
  }
`;

const TOGGLE_LIKE = gql`
  mutation ToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input)
  }
`;

export function useGetIsLikedLazy() {
  return useLazyQuery<GetIsLikedResponse, GetIsLikedVariables>(GET_IS_LIKED);
}

export function useToggleLike() {
  return useMutation<ToggleLikeResponse, { input: ToggleLikeInput }>(TOGGLE_LIKE);
}
