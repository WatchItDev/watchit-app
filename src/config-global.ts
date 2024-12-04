// @ts-nocheck
// routes
import { paths } from '@src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API || 'https://default-api.example.com';
export const ASSETS_API = import.meta.env.VITE_ASSETS_API || 'https://default-assets.example.com';

export const GLOBAL_CONSTANTS = {
  MMC_ADDRESS: process.env.VITE_MMC_ADDRESS || import.meta.env.VITE_MMC_ADDRESS || '',
  AGREEMENT_PORTAL_ADDRESS: process.env.VITE_AGREEMENT_PORTAL_ADDRESS || import.meta.env.VITE_AGREEMENT_PORTAL_ADDRESS || '',
  SUBSCRIPTION_POLICY_ADDRESS: process.env.VITE_SUBSCRIPTION_POLICY_ADDRESS || import.meta.env.VITE_SUBSCRIPTION_POLICY_ADDRESS || '',
  RIGHT_POLICY_AUTHORIZER: process.env.VITE_RIGHT_POLICY_AUTHORIZER || import.meta.env.VITE_RIGHT_POLICY_AUTHORIZER || '',
  SENTRY_AUTH_TOKEN: process.env.VITE_SENTRY_AUTH_TOKEN || import.meta.env.VITE_SENTRY_AUTH_TOKEN || '',
  SENTRY_DNS: process.env.VITE_SENTRY_DNS || import.meta.env.VITE_SENTRY_DNS || '',
  PINATA_API_KEY: process.env.VITE_PINATA_API_KEY || import.meta.env.VITE_PINATA_API_KEY || '',
  PINATA_SECRET_API_KEY: process.env.VITE_PINATA_SECRET_API_KEY || import.meta.env.VITE_PINATA_SECRET_API_KEY || '',
  WEB3_CLIENT_ID: process.env.VITE_WEB3_CLIENT_ID || import.meta.env.VITE_WEB3_CLIENT_ID || '',
  RPC: process.env.VITE_RPC || import.meta.env.VITE_RPC || '',
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API || '';
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_BEFORE_LOGIN = '/login';
