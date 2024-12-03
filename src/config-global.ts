// @ts-nocheck
// routes
import { paths } from '@src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.REACT_APP_HOST_API || 'https://default-api.example.com';
export const ASSETS_API = import.meta.env.REACT_APP_ASSETS_API || 'https://default-assets.example.com';

export const GLOBAL_CONSTANTS = {
  MMC_ADDRESS: process.env.REACT_APP_MMC_ADDRESS || import.meta.env.REACT_APP_MMC_ADDRESS || '',
  AGREEMENT_PORTAL_ADDRESS: process.env.REACT_APP_AGREEMENT_PORTAL_ADDRESS || import.meta.env.REACT_APP_AGREEMENT_PORTAL_ADDRESS || '',
  SUBSCRIPTION_POLICY_ADDRESS: process.env.REACT_APP_SUBSCRIPTION_POLICY_ADDRESS || import.meta.env.REACT_APP_SUBSCRIPTION_POLICY_ADDRESS || '',
  RIGHT_POLICY_AUTHORIZER: process.env.REACT_APP_RIGHT_POLICY_AUTHORIZER || import.meta.env.REACT_APP_RIGHT_POLICY_AUTHORIZER || '',
  SENTRY_AUTH_TOKEN: process.env.REACT_APP_SENTRY_AUTH_TOKEN || import.meta.env.REACT_APP_SENTRY_AUTH_TOKEN || '',
  SENTRY_DNS: process.env.REACT_APP_SENTRY_DNS || import.meta.env.REACT_APP_SENTRY_DNS || '',
  PINATA_API_KEY: process.env.REACT_APP_PINATA_API_KEY || import.meta.env.REACT_APP_PINATA_API_KEY || '',
  PINATA_SECRET_API_KEY: process.env.REACT_APP_PINATA_SECRET_API_KEY || import.meta.env.REACT_APP_PINATA_SECRET_API_KEY || '',
};

export const MAPBOX_API = import.meta.env.REACT_APP_MAPBOX_API || '';
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_BEFORE_LOGIN = '/login';
