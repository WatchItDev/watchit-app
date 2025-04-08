import { ERRORS } from '@src/libs/notifications/errors';
import {EncodeAbiParametersReturnType, Address} from "viem"
import {TransferData, WithdrawData} from "@src/hooks/types.ts"

// ----------------------------------------------------------------------
type AnyOptionError = string | number | boolean | object | undefined;

export interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: AnyOptionError;
}

export interface PolicyTerms {
  amount: string;
  currency: string;
  rateBasis: number;
  uri: string;
}

export interface Policy {
  policy: string;
  terms: PolicyTerms;
}

export interface Terms {
  amount: bigint; // amount in wei
  currency: string;
  rateBasis: number;
  uri: string;
}

// ----------------------------------------------------------------------

// Parameters to be passed to the subscribe function
export interface AuthorizePolicyParams {
  policyAddress: string; // The address to which the subscription applies
  data: EncodeAbiParametersReturnType; // The encoded data. EJ. For subscription policy is encoded (Price per day, address mmc)
}

// Define the return type of the useAuthorizePolicy hook
export interface UseAuthorizePolicyHook {
  data?: UseAuthorizePolicyResult;
  authorize: (params: AuthorizePolicyParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}
interface UseAuthorizePolicyLogEntry {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface UseAuthorizePolicyReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: UseAuthorizePolicyLogEntry[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface UseAuthorizePolicyResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: UseAuthorizePolicyLogEntry[];
  nonce: string;
  paymaster: string;
  receipt: UseAuthorizePolicyReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}

// ----------------------------------------------------------------------

export interface UseCampaignPauseHook {
  data?: UseCampaignPauseResult;
  pause: (campaignAddress: Address) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface UseCampaignPausedHook {
  paused: boolean;
  loading: boolean;
  error: HasAccessError | null;
  fetchCampaignPaused: (campaignAddress: Address) => Promise<boolean>;
}

// ----------------------------------------------------------------------

export interface CampaignRemoveFundsParams {
  campaignAddress: Address;
  amount: bigint;
}

export interface UseCampaignRemoveFundsHook {
  data?: UseCampaignRemoveFundsResult;
  removeFunds: (params: CampaignRemoveFundsParams) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}
interface UseCampaignRemoveFundsResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: UseCampaignRemoveFundsLogEntry[];
  nonce: string;
  paymaster: string;
  receipt: UseCampaignRemoveFundsReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}

interface UseCampaignRemoveFundsLogEntry {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface UseCampaignRemoveFundsReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: UseCampaignRemoveFundsLogEntry[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

// ----------------------------------------------------------------------

export interface UseCampaignUnPauseHook {
  data?: CampaignUnpauseResult;
  unPause: (campaignAddress: string) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface ConfigureCampaignParams {
  campaignAddress: Address;           // Address of the campaign contract to configure
  addFundsAmount: number;   // Amount to fund in addFunds
  fundsAllocationAmount: number;  // Amount for setFundsAllocation
  quotaLimit: number;           // Max rate limit for setMaxRateLimit
}

export interface UseConfigureCampaignHook {
  data?: ConfigureCampaignResult;
  configure: (params: ConfigureCampaignParams) => Promise<void>;
  loading: boolean;
}

// ----------------------------------------------------------------------

export interface CreateCampaignParams {
  policy: string;
  expiration: number;
  description: string;
}

export interface UseCreateCampaignHook {
  data?: CreateCampaignResult;
  create: (params: CreateCampaignParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface DepositParams {
  recipient: string; // address
  amount: number; // plain number
}

export interface UseDepositHook {
  data?: UseDepositResult;
  deposit: (params: DepositParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

interface UseDepositLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface UseDepositReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: UseDepositLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: number | null;
}

export interface UseDepositResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: UseDepositLog[];
  nonce: string;
  paymaster: string;
  receipt: UseDepositReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}

export interface UseDepositMetamaskData {
  approveTxHash: Address;
  depositTxHash: Address;
  approveReceipt: UseDepositMetamaskApproveReceipt;
  depositReceipt: UseDepositMetamaskDepositReceipt;
}

interface UseDepositMetamaskLogEntry {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface UseDepositMetamaskApproveReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: UseDepositMetamaskLogEntry[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

interface UseDepositMetamaskDepositLogEntry {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export interface UseDepositMetamaskDepositReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: UseDepositMetamaskDepositLogEntry[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}
// ----------------------------------------------------------------------

export interface ActiveLicensesError {
  message: string;
  code?: number;
  [key: string]: AnyOptionError;
}

export interface UseGetActiveLicensesHook {
  activeLicenses: Policy[];
  loading: boolean;
  error?: ActiveLicensesError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface GetAssetOwnerError {
  message: string;
  code?: number;
  [key: string]: AnyOptionError;
}

export interface UseGetAssetOwnerHook {
  ownerAddress?: Address;
  loading: boolean;
  error?: GetAssetOwnerError | null;
  fetchOwnerAddress: (assetIdHex: string) => Promise<Address | undefined>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignHook {
  campaign: boolean;
  loading: boolean;
  fetchCampaign: (
    account: Address,
    policy: Address
  ) => Promise<string>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignFundsAllocationHook {
  fundsAllocation: string;
  loading: boolean;
  error: HasAccessError | null;
  fetchFundsAllocation: (
    campaignAddress: Address
  ) => Promise<string | undefined>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignFundsBalanceHook {
  fundsBalance: bigint;
  loading: boolean;
  error: HasAccessError | null;
  fetchCampaignFundsBalance: (
    campaignAddress: Address
  ) => Promise<bigint>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignIsActiveHook {
  isActive: boolean;
  loading: boolean;
  fetchIsActive: (
    campaignAddress: Address,
    account: Address
  ) => Promise<string | undefined>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignIsReadyHook {
  isReady: boolean;
  loading: boolean;
  error: HasAccessError | null;
  fetchIsReady: (
    campaignAddress: Address
  ) => Promise<string | undefined>;
}
// ----------------------------------------------------------------------

export interface UseGetCampaignQuotaCounterHook {
  quotaCounter: number;
  loading: boolean;
  error: HasAccessError | null;
  fetchQuotaCounter: (
    campaignAddress: Address,
    account: Address
  ) => Promise<number>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignQuotaLimitHook {
  quotaLimit: number;
  loading: boolean;
  error: HasAccessError | null;
  fetchQuotaLimit: (
    campaignAddress: Address
  ) => Promise<number>;
}

// ----------------------------------------------------------------------

export interface UseGetCampaignTotalUsageHook {
  totalUsage: string;
  loading: boolean;
  error: HasAccessError | null;
  fetchTotalUsage: (
    campaignAddress: Address,
  ) => Promise<string | undefined>;
}

// ----------------------------------------------------------------------

export interface UseGetAuthorizedHolderPoliciesHook {
  authorizedHolderPolicies: Policy[];
  loading: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface UseGetPolicyAttestationHook {
  attestation?: string;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface UseGetPolicyTermsHook {
  terms?: Terms;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface TransactionLog {
  address: string;
  args: {
    amount: bigint;
    currency: string;
    recipient: string;
    origin: string;
  };
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: string;
  eventName: string;
  formattedAmount: string;
  logIndex: number;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export interface EventConfig {
  eventName: string;
  args: Record<string, string | bigint>;
  getEventType: (log: Record<string, string>, userAddress: string) => string;
}

// ----------------------------------------------------------------------

export interface UseGetSubscriptionCampaignHook {
  campaign: Address;
  loading: boolean;
  fetchSubscriptionCampaign: (account: Address) => Promise<string>;
}

// ----------------------------------------------------------------------

export interface SubtitleTrack {
  src: string;
  label: string;
  language: string;
  kind: 'subtitles';
  default: boolean;
}

export interface UseGetSubtitlesReturn {
  tracks: SubtitleTrack[];
  loading: boolean;
  getSubtitles: (cid: string) => Promise<SubtitleTrack[]>;
}

// ----------------------------------------------------------------------

export interface UseHasAccessHook {
  hasAccess?: boolean;
  loading: boolean;
  error?: HasAccessError | null;
  fetch: () => void;
}

// ----------------------------------------------------------------------

export interface UseHasRoleHook {
  hasRole?: boolean;
  loading: boolean;
  error?: HasAccessError | null;
  fetchHasRole: (roleId: number, account: Address) => void;
}

// ----------------------------------------------------------------------

export interface UseIsPolicyAuthorizedHook {
  isAuthorized?: boolean;
  loading: boolean;
  fetching: boolean;
  error?: HasAccessError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface UseIsVerifiedHook {
  isVerified: boolean | undefined;
  loading: boolean;
  error?: string | null;
}

// ----------------------------------------------------------------------

export interface Attachment {
  cid: string;
  type: string;
  title: string;
  description: string;
}

export interface MetadataData {
  title: string;
  description: string;
  attachments: Attachment[];
  custom_fields: Record<string, string>;
}

export interface Metadata {
  Type: string;
  Data: MetadataData;
}

export interface UseMetadataReturn {
  metadata: Metadata | null;
  loading: boolean;
  getMetadata: (cid: string) => Promise<Metadata>;
}

// ----------------------------------------------------------------------
//@TODO: Review this interface for the receipt
export interface RegisterAssetData {
  receipt?: any;
}

export interface UseRegisterAssetHook {
  data?: RegisterAssetData;
  registerAsset: (assetId: string) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface SponsoredAccessParams {
  holder: Address;
  campaignAddress: Address;
  policyAddress: Address;
  parties: Address[];
  payload: string;
}

export interface UseSponsoredAccessAgreementHook {
  data?: SponsoredAccessAgreementDetailsReturn;
  sponsoredAccessAgreement: (params: SponsoredAccessParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}
interface SponsoredAccessAgreementLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  topics: string[];
}

interface SponsoredAccessAgreementReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: SponsoredAccessAgreementLog[];
  transactionHash: string;
  transactionIndex: number;
}

export interface SponsoredAccessAgreementDetailsReturn {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: SponsoredAccessAgreementLog[];
  nonce: string;
  paymaster: string;
  receipt: SponsoredAccessAgreementReceipt;
}

// ----------------------------------------------------------------------

export interface SubscribeData {
  receipt?: any; // The subscribe receipt, to get the transaction hash use receipt.transactionHash
}

export interface UseSubscribeHook {
  data?: SubscribeData;
  subscribe: (params: SubscribeParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export interface SubscribeParams {
  holderAddress: string; // The address to which the subscription applies
  amount: string; // The amount for the subscription in MMC tokens
}

// ----------------------------------------------------------------------

export interface TransferParams {
  recipient: string;
  amount: number;
}

export interface UseTransferHook {
  data?: TransferData;
  transfer: (params: TransferParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface WithdrawParams {
  recipient: Address;
  amount: number;
}

export interface UseWithdrawHook {
  data?: WithdrawData;
  withdraw: (params: WithdrawParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export interface CampaignLog  {
  address: string;
  args: {
    campaign: string;
    description: string;
    expireAt: bigint;
    owner: string;
    policy: string;
    scopeId: string;
  };
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: string;
  eventName: string;
  formattedAmount: string;
  logIndex: number;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

// use-campaign-pause.ts
interface ReceiptLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  topics: string[];
}

interface Receipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: ReceiptLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface UseCampaignPauseResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: ReceiptLog[];
  nonce: string;
  paymaster: string;
  receipt: Receipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}
//use-create-campaign.ts
export interface TransactionCampaingLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export interface TransactionReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: TransactionCampaingLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface CreateCampaignResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: TransactionCampaingLog[];
  nonce: string;
  paymaster: string;
  receipt: TransactionReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}
//use-campaign-unpause.ts
export interface CampaignUnpauseLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export interface CampaignUnpauseReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: CampaignUnpauseLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface CampaignUnpauseResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: CampaignUnpauseLog[];
  nonce: string;
  paymaster: string;
  receipt: CampaignUnpauseReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}

//use-configure-campaign.ts
interface ConfigureCampaignLog {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: number;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

interface ConfigureCampaignReceipt {
  blockHash: string;
  blockNumber: bigint;
  contractAddress: string | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  gasUsed: bigint;
  logs: ConfigureCampaignLog[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string | null;
}

export interface ConfigureCampaignResult {
  actualGasCost: bigint;
  actualGasUsed: bigint;
  entryPoint: string;
  logs: ConfigureCampaignLog[];
  nonce: string;
  paymaster: string;
  receipt: ConfigureCampaignReceipt;
  sender: string;
  success: boolean;
  userOpHash: string;
}


