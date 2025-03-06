import { ERRORS } from '@notifications/errors.ts';
import { Address } from 'viem';

// ----------------------------------------------------------------------

export interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
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
  amount: any; // amount in wei
  currency: string;
  rateBasis: number;
  uri: string;
}

// ----------------------------------------------------------------------

// Parameters to be passed to the subscribe function
export interface AuthorizePolicyParams {
  policyAddress: string; // The address to which the subscription applies
  data: any; // The encoded data. EJ. For subscription policy is encoded (Price per day, address mmc)
}

// Define the return type of the useAuthorizePolicy hook
export interface UseAuthorizePolicyHook {
  data?: any;
  authorize: (params: AuthorizePolicyParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface UseCampaignPauseHook {
  data?: any;
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
  data?: any;
  removeFunds: (params: CampaignRemoveFundsParams) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface UseCampaignUnPauseHook {
  data?: any;
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
  data?: any;
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
  data?: any;
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
  data?: any;
  deposit: (params: DepositParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface ActiveLicensesError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetActiveLicensesHook {
  activeLicenses: any[];
  loading: boolean;
  error?: ActiveLicensesError | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export interface GetAssetOwnerError {
  message: string;
  code?: number;
  [key: string]: any;
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
  ) => Promise<any>;
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
  quotaCounter: string;
  loading: boolean;
  error: HasAccessError | null;
  fetchQuotaCounter: (
    campaignAddress: Address,
    account: Address
  ) => Promise<string | undefined>;
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
  getEventType: (log: any, userAddress: string) => string;
}

// ----------------------------------------------------------------------

export interface UseGetSubscriptionCampaignHook {
  campaign: any;
  loading: boolean;
  fetchSubscriptionCampaign: (account: Address) => Promise<any>;
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
  custom_fields: any;
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
  data?: any;
  sponsoredAccessAgreement: (params: SponsoredAccessParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
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
  data?: any;
  transfer: (params: TransferParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface TransferAssetData {
  receipt?: any;
}

export interface UseTransferAssetHook {
  data?: TransferAssetData;
  transferAsset: (destinationAddress: string, assetId: string) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

export interface WithdrawParams {
  recipient: Address;
  amount: number;
}

export interface UseWithdrawHook {
  data?: any;
  withdraw: (params: WithdrawParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

// ----------------------------------------------------------------------

