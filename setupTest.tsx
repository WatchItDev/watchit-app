import * as matchers from '@testing-library/jest-dom/matchers';
import {cleanup} from "@testing-library/react";
import {afterEach, beforeAll, expect, vi} from 'vitest';

expect.extend(matchers);

// Test Hooks
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {
      // Intentionally left empty for mocking purposes
    }
    unobserve() {
      // Intentionally left empty for mocking purposes
    }
    disconnect() {
      // Intentionally left empty for mocking purposes
    }
  };
});

afterEach(() => {
  cleanup();
})

// Mocks
vi.mock('react-i18next');
// Iconify mock
vi.mock('@src/components/iconify', () => ({
  __esModule: true,
  default: ({ icon, sx, ...props }: { icon: string, sx?: object }) => (
    <span data-testid="iconify" data-icon={icon} data-sx={JSON.stringify(sx)} {...props} />
  )
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }
}));

vi.mock('@src/config-global.ts', () => ({
  GLOBAL_CONSTANTS: {
    MMC_ADDRESS: 'mock-mmc-address',
    SUBSCRIPTION_POLICY_ADDRESS: 'mock-subscription-policy-address',
    ACCESS_WORKFLOW_ADDRESS: 'mock-access-workflow-address',
    ACCESS_AGG_ADDRESS: 'mock-access-agg-address',
    POLICIES_AGG_ADDRESS: 'mock-policies-agg-address',
    LEDGER_VAULT_ADDRESS: 'mock-ledger-vault-address',
    SUBSCRIPTION_CAMPAIGN_ADDRESS: 'mock-subscription-campaign-address',
    OKLINK_API_KEY: 'mock-oklink-api-key',
    RIGHT_POLICY_AUTHORIZER: 'mock-right-policy-authorizer',
    ACCESS_MANAGER_ADDRESS: 'mock-access-manager-address',
    ASSET_OWNERSHIP_ADDRESS: 'mock-asset-ownership-address',
    SENTRY_AUTH_TOKEN: 'mock-sentry-auth-token',
    SENTRY_DSN: 'mock-sentry-dsn',
    PINATA_API_KEY: 'mock-pinata-api-key',
    PINATA_SECRET_API_KEY: 'mock-pinata-secret-api-key',
    WEB3_CLIENT_ID: 'mock-web3-client-id',
    PIMLICO: 'mock-pimlico',
    NEXT_PUBLIC_SUPABASE_URL: 'https://mock.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
    ENVIRONMENT: 'mock-environment',
    INFURA_API_KEY: 'mock-infura-api-key',
    EMAIL_API_KEY: 'mock-email-api-key',
    EMAIL_SERVICE_ID: 'mock-email-service-id',
    EMAIL_TEMPLATE_ID: 'mock-email-template-id',
    SENDER_EMAIL: 'mock-sender-email',
    BASE_URL: 'mock-base-url',
    LOGO_URL: 'mock-logo-url',
    EARN_TOKEN_SERVICE_URL: 'mock-earn-token-service-url',
  }
}));

// @ts-ignore
window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
