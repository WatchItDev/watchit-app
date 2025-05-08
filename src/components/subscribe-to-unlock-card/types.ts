import { Post } from '@src/graphql/generated/graphql.ts';

export interface SubscribeToUnlockCardProps {
  post: Post;
  onSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
}
