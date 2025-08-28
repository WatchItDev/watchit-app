import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { UseGetCampaignHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaign = (): UseGetCampaignHook => {
  const [campaign, setCampaign] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCampaign = useCallback(
    async (account: Address, policy: Address): Promise<Address | null> => {
      if (!account || !policy) {
        throw new Error(
          'Account or Policy address is missing while fetching campaign.',
        );
      }
      setLoading(true);
      try {
        const campaignAddress: Address = (await publicClient.readContract({
          address: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS,
          abi: CampaignRegistryAbi.abi,
          functionName: 'getCampaign',
          args: [account, policy],
        })) as Address;
        setCampaign(campaignAddress);
        return campaignAddress as Address;
      } catch (err) {
        console.error('Error fetching campaign address:', err);
        setCampaign(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { campaign, loading, fetchCampaign };
};
