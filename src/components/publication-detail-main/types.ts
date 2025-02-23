
export interface PublicationDetailProps {
  post: any;
  handleSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
  hasAccess: boolean;
}
