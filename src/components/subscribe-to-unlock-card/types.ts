// @ts-expect-error No error in next line
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { AnyPublication } from '@lens-protocol/api-bindings';

export interface SubscribeToUnlockCardProps {
  post: ReadResult<AnyPublication>;
  onSubscribe: () => void;
  handleRefetchAccess: () => void;
  loadingSubscribe: boolean;
  subscribeDisabled: boolean;
}
