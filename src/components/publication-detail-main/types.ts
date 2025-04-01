import {Post} from "@lens-protocol/api-bindings"

export interface PublicationDetailProps {
  post: Post;
  handleSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled?: boolean;
  hasAccess: boolean;
}
