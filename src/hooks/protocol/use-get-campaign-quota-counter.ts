import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { HasAccessError, UseGetCampaignQuotaCounterHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaignQuotaCounter = (): UseGetCampaignQuotaCounterHook => {
  const [quotaCounter, setQuotaCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchQuotaCounter = useCallback(
    async (campaignAddress: Address, account: Address): Promise<number> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return 0;
      }
      if (!account) {
        setError({ message: 'Account address is missing.' });
        return 0;
      }
      setLoading(true);
      try {
        const limit = (await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getQuotaCounter',
          args: [account],
        })) as bigint;
        const limitNumber = Number(limit);
        setQuotaCounter(limitNumber);
        setError(null);
        return limitNumber;
      } catch (err) {
        console.error('Error fetching quota counter:', err);
        setQuotaCounter(0);
        setError({ message: err?.message || 'Error fetching quota counter' });
        return 0;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { quotaCounter, loading, error, fetchQuotaCounter };
};
