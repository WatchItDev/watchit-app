import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UseGetCampaignHook } from '@src/hooks/protocol/types.ts';
import { notifyError } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';

export const useGetCampaign = (): UseGetCampaignHook => {
  const [campaign, setCampaign] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCampaign = useCallback(
    async (
      account: Address,
      policy: Address
    ): Promise<any> => {
      if (!account || !policy) {
        throw new Error('Account or Policy address is missing while fetching campaign.');
      }
      setLoading(true);
      try {
        const active: any = await publicClient.readContract({
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS,
          abi: CampaignRegistryAbi.abi,
          functionName: 'getCampaign',
          args: [account, policy],
        });
        setCampaign(active);
        return active;
      } catch (err: any) {
        console.error('Error fetching is active:', err);
        setCampaign(null);
        notifyError(ERRORS.GET_CAMPAIGN_ERROR);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { campaign, loading, fetchCampaign };
};
