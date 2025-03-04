import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UseGetCampaignHook } from '@src/hooks/protocol/types.ts';

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
        const campaignAddress: any = await publicClient.readContract({
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS,
          abi: CampaignRegistryAbi.abi,
          functionName: 'getCampaign',
          args: [account, policy],
        });
        setCampaign(campaignAddress);
        //
        return campaignAddress;
      } catch (err: any) {
        console.error('Error fetching campaign address:', err);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { campaign, loading, fetchCampaign };
};
