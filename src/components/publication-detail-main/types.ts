import { Post } from '@src/graphql/generated/graphql.ts';


export interface PublicationDetailProps {
  post: Post;
  handleSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled?: boolean;
  hasAccess: boolean;
}
