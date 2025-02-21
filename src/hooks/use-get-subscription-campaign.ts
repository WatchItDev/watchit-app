import { useCallback } from 'react';
import { Address } from 'viem';
import { useGetCampaign } from './use-get-campaign.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

export interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetSubscriptionCampaignHook {
  campaign: any;
  loading: boolean;
  error: HasAccessError | null;
  fetchSubscriptionCampaign: (account: Address) => Promise<any>;
}

export const useGetSubscriptionCampaign = (): UseGetSubscriptionCampaignHook => {
  const { campaign, loading, error, fetchCampaign } = useGetCampaign();

  const fetchSubscriptionCampaign = useCallback(
    async (account: Address) => {
      if (!account) {
        throw new Error('Account address is required.');
      }
      return await fetchCampaign(account, GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS);
    },
    [fetchCampaign]
  );

  return { campaign, loading, error, fetchSubscriptionCampaign };
};
