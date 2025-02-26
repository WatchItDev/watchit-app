export interface SubscribeToUnlockCardProps {
  post: any;
  onSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
}
