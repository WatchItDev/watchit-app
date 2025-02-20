import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetCampaignQuotaLimitHook {
  quotaLimit: number;
  loading: boolean;
  error: HasAccessError | null;
  fetchQuotaLimit: (
    campaignAddress: Address
  ) => Promise<number>;
}

export const useGetCampaignQuotaLimit = (): UseGetCampaignQuotaLimitHook => {
  const [quotaLimit, setQuotaLimit] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchQuotaLimit = useCallback(
    async (
      campaignAddress: Address
    ): Promise<number> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return 0;
      }
      setLoading(true);
      try {
        const limit: number = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getQuotaLimit',
          args: [],
        }) as number;
        setQuotaLimit(limit);
        setError(null);
        return limit;
      } catch (err: any) {
        console.error('Error fetching quota Limit:', err);
        setQuotaLimit(0);
        setError({ message: err?.message || 'Error fetching quota Limit' });
        return 0
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { quotaLimit, loading, error, fetchQuotaLimit };
};
