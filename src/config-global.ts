// @ts-nocheck
// routes
import { paths } from '@src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API || 'https://default-api.example.com';
export const ASSETS_API = import.meta.env.VITE_ASSETS_API || 'https://default-assets.example.com';

export const GLOBAL_CONSTANTS = {
  MMC_ADDRESS: process.env.VITE_MMC_ADDRESS || import.meta.env.VITE_MMC_ADDRESS || '',
  SUBSCRIPTION_POLICY_ADDRESS:
    process.env.VITE_SUBSCRIPTION_POLICY_ADDRESS ||
    import.meta.env.VITE_SUBSCRIPTION_POLICY_ADDRESS ||
    '',
  ACCESS_WORKFLOW_ADDRESS:
    process.env.VITE_ACCESS_WORKFLOW_ADDRESS || import.meta.env.VITE_ACCESS_WORKFLOW_ADDRESS || '',
  ACCESS_AGG_ADDRESS:
    process.env.VITE_ACCESS_AGG_ADDRESS || import.meta.env.VITE_ACCESS_AGG_ADDRESS || '',
  POLICIES_AGG_ADDRESS:
    process.env.VITE_POLICIES_AGG_ADDRESS || import.meta.env.VITE_POLICIES_AGG_ADDRESS || '',
  LEDGER_VAULT_ADDRESS:
    process.env.VITE_LEDGER_VAULT_ADDRESS || import.meta.env.VITE_LEDGER_VAULT_ADDRESS || '',
  SUBSCRIPTION_CAMPAIGN_ADDRESS:
    process.env.VITE_SUBSCRIPTION_CAMPAIGN_ADDRESS || import.meta.env.VITE_SUBSCRIPTION_CAMPAIGN_ADDRESS || '',
  OKLINK_API_KEY: process.env.VITE_OKLINK_API_KEY || import.meta.env.VITE_OKLINK_API_KEY || '',
  RIGHT_POLICY_AUTHORIZER:
    process.env.VITE_RIGHT_POLICY_AUTHORIZER || import.meta.env.VITE_RIGHT_POLICY_AUTHORIZER || '',
  SENTRY_AUTH_TOKEN:
    process.env.VITE_SENTRY_AUTH_TOKEN || import.meta.env.VITE_SENTRY_AUTH_TOKEN || '',
  SENTRY_DNS: process.env.VITE_SENTRY_DNS || import.meta.env.VITE_SENTRY_DNS || '',
  PINATA_API_KEY: process.env.VITE_PINATA_API_KEY || import.meta.env.VITE_PINATA_API_KEY || '',
  PINATA_SECRET_API_KEY:
    process.env.VITE_PINATA_SECRET_API_KEY || import.meta.env.VITE_PINATA_SECRET_API_KEY || '',
  WEB3_CLIENT_ID: process.env.VITE_WEB3_CLIENT_ID || import.meta.env.VITE_WEB3_CLIENT_ID || '',
  PIMLICO: process.env.VITE_PIMLICO || import.meta.env.VITE_PIMLICO || '',
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.VITE_SUPABASE_API_KEY || import.meta.env.VITE_SUPABASE_API_KEY || '',
  ENVIRONMENT: process.env.NODE_ENV || import.meta.env.VITE_ENVIRONMENT || 'development',
  INFURA_API_KEY: process.env.VITE_INFURA_API_KEY || import.meta.env.VITE_INFURA_API_KEY || '',
  EMAIL_API_KEY: process.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  EMAIL_SERVICE_ID: process.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  EMAIL_TEMPLATE_ID: process.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API || '';
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_BEFORE_LOGIN = '/login';
