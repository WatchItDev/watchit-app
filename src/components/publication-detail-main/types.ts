// @ts-expect-error No error in this context
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated"

export interface PublicationDetailProps {
  post: Post;
  handleSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled?: boolean;
  hasAccess: boolean;
}
