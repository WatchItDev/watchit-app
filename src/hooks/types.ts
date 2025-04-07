export interface Invitation {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  sender_email: string;
  destination: string;
  sender_id: string;
  receiver_id: string | null;
  payload: Record<string, string>;
  created_at: string;
}

export enum NotificationCategories {
  FOLLOW = 'FOLLOW',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  JOIN = 'JOIN',
  MENTION = 'MENTION',
  TRANSFER = 'TRANSFER',
}

export interface NotificationColumnsProps {
  id: string;
  created_at: string | Date;
  category: NotificationCategories;
  payload: Record<string, string>;
  read: boolean;
  receiver_id: string;
  sender_id: string;
}

export interface NotificationItemProps {
  id: string;
  notification: NotificationColumnsProps;
  onMarkAsRead: (id: string) => void;
}

//use-submit-assets-to-lens.ts
export interface SuccessResult {
  hash: string;
  status: "success";
}

export interface ErrorResult {
  hash: string;
  status: "error";
  message: string;
}

export interface UseSubmitAssetToLensReturn {
  data: SuccessResult[];
  errors: ErrorResult[];
  loading: boolean;
  submitAssetToLens: (hashesString: string) => Promise<void>;
}

// use-search-publications.ts
export interface SupabasePublication {
  description: string;
  post_id: string;
  title: string;
}

//use-notification-payload.ts
export interface NotificationPayload {
  type: string;
  category: string;
  data: {
    from: {
      id: string;
      displayName?: string;
      avatar?: string;
    };
    to: {
      id: string;
      displayName?: string;
      avatar?: string;
    };
    content: Record<string, string>;
  };
}

//use-withdraw.ts
export interface WithdrawData {
  actualGasCost: bigint;
  actualGasUsed: number;
  entryPoint: string;
  logs: LogEntry[];
  nonce: string;
  paymaster: string;
  receipt: ReceiptData;
  sender: string;
  success: boolean;
  userOpHash: string;
}

interface LogEntry {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface ReceiptData {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: LogEntry[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface TransferData {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: TransferDataLog[];
  nonce: string;
  paymaster: string;
  receipt: TransferDataReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}

interface TransferDataLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  topics: string[];
}

interface TransferDataReceipt{
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: TransferDataLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

