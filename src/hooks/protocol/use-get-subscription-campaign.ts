import { useCallback } from 'react';
import { Address } from 'viem';
import { useGetCampaign } from './use-get-campaign.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UseGetSubscriptionCampaignHook } from '@src/hooks/protocol/types.ts';

export const useGetSubscriptionCampaign = (): UseGetSubscriptionCampaignHook => {
  const { campaign, loading, fetchCampaign } = useGetCampaign();

  const fetchSubscriptionCampaign = useCallback(async (account: Address) => {
      return await fetchCampaign(account, GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS);
  }, []);

  return { campaign, loading, fetchSubscriptionCampaign };
};
