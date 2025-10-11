import { gql, useMutation } from '@apollo/client';

type HidePostVariables = {
  postId: number;
};

type HidePostResponse = {
  hidePost: boolean | null;
};

const HIDE_POST = gql`
  mutation HidePost($postId: Int!) {
    hidePost(input: { postId: $postId })
  }
`;

export function useHidePost() {
  return useMutation<HidePostResponse, HidePostVariables>(HIDE_POST);
}
