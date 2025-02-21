import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetCampaignHook {
  campaign: boolean;
  loading: boolean;
  error: HasAccessError | null;
  fetchCampaign: (
    account: Address,
    policy: Address
  ) => Promise<any>;
}

export const useGetCampaign = (): UseGetCampaignHook => {
  const [campaign, setCampaign] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchCampaign = useCallback(
    async (
      account: Address,
      policy: Address
    ): Promise<any> => {
      if (!account) {
        setError({ message: 'Account address is missing.' });
        return;
      }
      if (!policy) {
        setError({ message: 'Account address is missing.' });
        return;
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
        setError(null);
        return active;
      } catch (err: any) {
        console.error('Error fetching is active:', err);
        setCampaign(null);
        setError({ message: err?.message || 'Error fetching is active' });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { campaign, loading, error, fetchCampaign };
};
