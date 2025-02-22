import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetCampaignIsReadyHook {
  isReady: boolean;
  loading: boolean;
  error: HasAccessError | null;
  fetchIsReady: (
    campaignAddress: Address
  ) => Promise<string | undefined>;
}

export const useGetCampaignIsReady = (): UseGetCampaignIsReadyHook => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchIsReady = useCallback(
    async (
      campaignAddress: Address
    ): Promise<string | undefined> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return;
      }
      setLoading(true);
      try {
        const ready: any = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'isReady',
          args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
        });
        setIsReady(ready);
        setError(null);
        return ready;
      } catch (err: any) {
        console.error('Error fetching is Ready:', err);
        setIsReady(false);
        setError({ message: err?.message || 'Error fetching is Ready' });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { isReady, loading, error, fetchIsReady };
};
