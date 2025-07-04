/// <reference types="vite/client" />

import { paths } from "@src/routes/paths";
import { Address } from "viem";

export interface GlobalConstants {
  MMC_ADDRESS: Address;
  SUBSCRIPTION_POLICY_ADDRESS: Address;
  ACCESS_WORKFLOW_ADDRESS: Address;
  ACCESS_AGG_ADDRESS: Address;
  POLICIES_AGG_ADDRESS: Address;
  LEDGER_VAULT_ADDRESS: Address;
  SUBSCRIPTION_CAMPAIGN_ADDRESS: Address;
  OKLINK_API_KEY: string;
  RIGHT_POLICY_AUTHORIZER: Address;
  ACCESS_MANAGER_ADDRESS: Address;
  ASSET_OWNERSHIP_ADDRESS: Address;
  CAMPAIGN_REGISTRY_ADDRESS: Address;
  CAMPAIGN_SUBSCRIPTION_TPL_ADDRESS: Address;
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  PINATA_API_KEY: string;
  PINATA_SECRET_API_KEY: string;
  WEB3_CLIENT_ID: string;
  PIMLICO: string;
  RPC_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  ENVIRONMENT: string;
  INFURA_API_KEY: string;
  EMAIL_API_KEY: string;
  EMAIL_SERVICE_ID: string;
  EMAIL_TEMPLATE_ID: string;
  SENDER_EMAIL: string;
  BASE_URL: string;
  LOGO_URL: string;
  EARN_TOKEN_SERVICE_URL: string;
  WATCHIT_GET_MEDIA_CONTENT_URL: string;
  ATTESTATION_BASE_URL: string;
  FROM_BLOCK: bigint | string | number;
  GQL_ENDPOINT: string;
  OPEN_COLLECTIVE: string;
  TERMS_AND_CONDITIONS: string;
}

export const GLOBAL_CONSTANTS: GlobalConstants = {
  MMC_ADDRESS: process.env.VITE_MMC_ADDRESS || import.meta.env.VITE_MMC_ADDRESS,
  SUBSCRIPTION_POLICY_ADDRESS:
    process.env.VITE_SUBSCRIPTION_POLICY_ADDRESS ||
    import.meta.env.VITE_SUBSCRIPTION_POLICY_ADDRESS,
  ACCESS_WORKFLOW_ADDRESS:
    process.env.VITE_ACCESS_WORKFLOW_ADDRESS || import.meta.env.VITE_ACCESS_WORKFLOW_ADDRESS,
  ACCESS_AGG_ADDRESS:
    process.env.VITE_ACCESS_AGG_ADDRESS || import.meta.env.VITE_ACCESS_AGG_ADDRESS,
  POLICIES_AGG_ADDRESS:
    process.env.VITE_POLICIES_AGG_ADDRESS || import.meta.env.VITE_POLICIES_AGG_ADDRESS,
  LEDGER_VAULT_ADDRESS:
    process.env.VITE_LEDGER_VAULT_ADDRESS || import.meta.env.VITE_LEDGER_VAULT_ADDRESS,
  SUBSCRIPTION_CAMPAIGN_ADDRESS:
    process.env.VITE_SUBSCRIPTION_CAMPAIGN_ADDRESS ||
    import.meta.env.VITE_SUBSCRIPTION_CAMPAIGN_ADDRESS,
  OKLINK_API_KEY: process.env.VITE_OKLINK_API_KEY || import.meta.env.VITE_OKLINK_API_KEY || "",
  RIGHT_POLICY_AUTHORIZER:
    process.env.VITE_RIGHT_POLICY_AUTHORIZER || import.meta.env.VITE_RIGHT_POLICY_AUTHORIZER || "",
  ACCESS_MANAGER_ADDRESS:
    process.env.VITE_ACCESS_MANAGER_ADDRESS || import.meta.env.VITE_ACCESS_MANAGER_ADDRESS,
  ASSET_OWNERSHIP_ADDRESS:
    process.env.VITE_ASSET_OWNERSHIP_ADDRESS || import.meta.env.VITE_ASSET_OWNERSHIP_ADDRESS,
  CAMPAIGN_REGISTRY_ADDRESS:
    process.env.VITE_CAMPAIGN_REGISTRY_ADDRESS || import.meta.env.VITE_CAMPAIGN_REGISTRY_ADDRESS,
  CAMPAIGN_SUBSCRIPTION_TPL_ADDRESS:
    process.env.VITE_CAMPAIGN_SUBSCRIPTION_TPL_ADDRESS ||
    import.meta.env.VITE_CAMPAIGN_SUBSCRIPTION_TPL_ADDRESS,
  SENTRY_AUTH_TOKEN:
    process.env.VITE_SENTRY_AUTH_TOKEN || import.meta.env.VITE_SENTRY_AUTH_TOKEN || "",
  SENTRY_DSN: process.env.VITE_SENTRY_DSN || import.meta.env.VITE_SENTRY_DSN || "",
  PINATA_API_KEY: process.env.VITE_PINATA_API_KEY || import.meta.env.VITE_PINATA_API_KEY || "",
  PINATA_SECRET_API_KEY:
    process.env.VITE_PINATA_SECRET_API_KEY || import.meta.env.VITE_PINATA_SECRET_API_KEY || "",
  WEB3_CLIENT_ID: process.env.VITE_WEB3_CLIENT_ID || import.meta.env.VITE_WEB3_CLIENT_ID || "",
  PIMLICO: process.env.VITE_PIMLICO || import.meta.env.VITE_PIMLICO || "",
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.VITE_SUPABASE_API_KEY || import.meta.env.VITE_SUPABASE_API_KEY || "",
  ENVIRONMENT: process.env.NODE_ENV || import.meta.env.VITE_ENVIRONMENT || "development",
  INFURA_API_KEY: process.env.VITE_INFURA_API_KEY || import.meta.env.VITE_INFURA_API_KEY || "",
  EMAIL_API_KEY:
    process.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  EMAIL_SERVICE_ID:
    process.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  EMAIL_TEMPLATE_ID:
    process.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  SENDER_EMAIL: process.env.VITE_SENDER_EMAIL || import.meta.env.VITE_SENDER_EMAIL || "",
  BASE_URL: process.env.VITE_BASE_URL || import.meta.env.VITE_BASE_URL || "",
  LOGO_URL: process.env.VITE_LOGO_URL || import.meta.env.VITE_LOGO_URL || "",
  EARN_TOKEN_SERVICE_URL:
    process.env.VITE_EARN_TOKEN_SERVICE_URL || import.meta.env.VITE_EARN_TOKEN_SERVICE_URL || "",
  WATCHIT_GET_MEDIA_CONTENT_URL:
    process.env.VITE_WATCHIT_GET_MEDIA_CONTENT_URL ||
    import.meta.env.VITE_WATCHIT_GET_MEDIA_CONTENT_URL ||
    "",
  ATTESTATION_BASE_URL:
    process.env.VITE_URL_ATTESTATION_BASE || import.meta.env.VITE_URL_ATTESTATION_BASE || "",
  FROM_BLOCK: process.env.VITE_BLOCK_FROM || import.meta.env.VITE_BLOCK_FROM || 0n,
  GQL_ENDPOINT: process.env.VITE_GQL_ENDPOINT || import.meta.env.VITE_GQL_ENDPOINT || 'http://localhost:4000/graphql',
  OPEN_COLLECTIVE: process.env.VITE_URL_OPEN_COLLECTIVE || import.meta.env.VITE_URL_OPEN_COLLECTIVE || '',
  TERMS_AND_CONDITIONS: process.env.VITE_URL_TERMS_AND_CONDITIONS || import.meta.env.VITE_URL_TERMS_AND_CONDITIONS || '',
  RPC_URL: process.env.VITE_POLYGON_AMOY_RPC || import.meta.env.VITE_POLYGON_AMOY_RPC || 'https://polygon-amoy-bor-rpc.publicnode.com',
};

export const PATH_AFTER_LOGIN = paths.dashboard.root;
