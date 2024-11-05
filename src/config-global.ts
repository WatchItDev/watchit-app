// @ts-nocheck
// routes
import { paths } from '@src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.REACT_APP_HOST_API || 'https://default-api.example.com';
export const ASSETS_API = import.meta.env.REACT_APP_ASSETS_API || 'https://default-assets.example.com';

export const FIREBASE_API = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.REACT_APP_FIREBASE_APPID || '',
  measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID || '',
};

export const AMPLIFY_API = {
  userPoolId: import.meta.env.REACT_APP_AWS_AMPLIFY_USER_POOL_ID || '',
  userPoolWebClientId: import.meta.env.REACT_APP_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID || '',
  region: import.meta.env.REACT_APP_AWS_AMPLIFY_REGION || '',
};

export const AUTH0_API = {
  clientId: import.meta.env.REACT_APP_AUTH0_CLIENT_ID || '',
  domain: import.meta.env.REACT_APP_AUTH0_DOMAIN || '',
  callbackUrl: import.meta.env.REACT_APP_AUTH0_CALLBACK_URL || '',
};

export const MAPBOX_API = import.meta.env.REACT_APP_MAPBOX_API || '';
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_BEFORE_LOGIN = '/login';
