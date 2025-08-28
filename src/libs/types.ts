export interface CalculateItemsPerSlideProps {
  parentWidth: number;
  minItemWidth: number;
  maxItemWidth: number;
}

export interface ProcessedTransactionData {
  id: string;
  name: string;
  avatarUrl: string;
  type: string;
  message: string;
  category: string;
  date: bigint;
  status: string;
  timestamp?: number;
  amount: string | null;
}

export type EventName =
  | 'transferFrom'
  | 'transferTo'
  | 'deposit'
  | 'withdraw'
  | 'locked'
  | 'claimed'
  | 'approved'
  | 'collected'
  | 'released';

export type TransactionArgs = Record<string, string | bigint>;

export interface EventConfig {
  getName: (args: TransactionArgs) => string;
  getAvatarUrl: (args: TransactionArgs) => string;
}

export interface Transaction {
  address: string;
  args: TransactionArgs;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: EventName;
  eventName: string;
  formattedAmount: string;
  logIndex: bigint;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: bigint;
}

/**
 * Interface for IPFS metadata
 */
export type IPFSMetadata = Record<
  string,
  string | number | boolean | object | null
>;

/**
 * Pinata headers interface
 */
export interface PinataHeaders {
  pinata_api_key: string;
  pinata_secret_api_key: string;
  'Content-Type'?: string;
  [key: string]: string | undefined;
}

/**
 * Pinata response interface
 */
export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  [key: string]: unknown;
}

export interface NotificationOptions {
  variant?: NotificationType;
  autoHideDuration?: number;
  [key: string]: unknown;
}

export type NotificationType = 'error' | 'success' | 'warning' | 'info';
