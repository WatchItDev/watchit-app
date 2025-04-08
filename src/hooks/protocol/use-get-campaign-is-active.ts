import { useCallback, useState } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UseGetCampaignIsActiveHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaignIsActive = (): UseGetCampaignIsActiveHook => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchIsActive = useCallback(
    async (
      campaignAddress: Address,
      account: Address
    ): Promise<string | undefined> => {
      if (!campaignAddress || !account) {
        throw new Error('CampaignAddress or Account address is missing while fetching campaign.');
      }
      setLoading(true);
      try {
        const active = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'isActive',
          args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS, account],
        }) as boolean;
        setIsActive(active);
        return active ? 'true' : 'false';
      } catch (err) {
        console.error('Error fetching campaign isActive:', err);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { isActive, loading, fetchIsActive };
};
