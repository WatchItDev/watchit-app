import { describe, it, expect } from 'vitest'
import { GLOBAL_CONSTANTS } from '@src/config-global'

describe('GLOBAL_CONSTANTS', () => {
  const expectedProperties = [
    'MMC_ADDRESS',
    'SUBSCRIPTION_POLICY_ADDRESS',
    'ACCESS_WORKFLOW_ADDRESS',
    'ACCESS_AGG_ADDRESS',
    'POLICIES_AGG_ADDRESS',
    'LEDGER_VAULT_ADDRESS',
    'SUBSCRIPTION_CAMPAIGN_ADDRESS',
    'OKLINK_API_KEY',
    'RIGHT_POLICY_AUTHORIZER',
    'ACCESS_MANAGER_ADDRESS',
    'ASSET_OWNERSHIP_ADDRESS',
    'SENTRY_AUTH_TOKEN',
    'SENTRY_DSN',
    'PINATA_API_KEY',
    'PINATA_SECRET_API_KEY',
    'WEB3_CLIENT_ID',
    'PIMLICO',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'ENVIRONMENT',
    'INFURA_API_KEY',
    'EMAIL_API_KEY',
    'EMAIL_SERVICE_ID',
    'EMAIL_TEMPLATE_ID',
    'SENDER_EMAIL',
    'BASE_URL',
    'LOGO_URL',
    'EARN_TOKEN_SERVICE_URL',
  ]

  expectedProperties.forEach((property) => {
    it(`should have property ${property}`, () => {
      expect(GLOBAL_CONSTANTS).toHaveProperty(property)
    })
  })
})
