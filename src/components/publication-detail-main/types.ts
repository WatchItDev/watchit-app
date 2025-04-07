import {Post} from "@lens-protocol/react-web"

export interface PublicationDetailProps {
  post: Post;
  handleSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled?: boolean;
  hasAccess: boolean;
}
