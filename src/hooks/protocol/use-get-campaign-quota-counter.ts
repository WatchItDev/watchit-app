import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { HasAccessError, UseGetCampaignQuotaCounterHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaignQuotaCounter = (): UseGetCampaignQuotaCounterHook => {
  const [quotaCounter, setQuotaCounter] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchQuotaCounter = useCallback(
    async (
      campaignAddress: Address,
      account: Address
    ): Promise<string | undefined> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return;
      }
      if (!account) {
        setError({ message: 'Account address is missing.' });
        return;
      }
      setLoading(true);
      try {
        const limit: bigint = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getQuotaCounter',
          args: [account],
        }) as bigint;
        const limitStr = limit.toString();
        setQuotaCounter(limitStr);
        setError(null);
        return limitStr;
      } catch (err: any) {
        console.error('Error fetching quota counter:', err);
        setQuotaCounter('0');
        setError({ message: err?.message || 'Error fetching quota counter' });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { quotaCounter, loading, error, fetchQuotaCounter };
};
