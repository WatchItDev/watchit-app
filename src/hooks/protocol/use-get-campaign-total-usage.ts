import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import {
  HasAccessError,
  UseGetCampaignTotalUsageHook,
} from '@src/hooks/protocol/types.ts';

export const useGetCampaignTotalUsage = (): UseGetCampaignTotalUsageHook => {
  const [totalUsage, setTotalUsage] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchTotalUsage = useCallback(
    async (campaignAddress: Address): Promise<string | undefined> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return;
      }

      setLoading(true);
      try {
        const limit: bigint = (await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getTotalUsage',
          args: [],
        })) as bigint;
        const limitStr = limit.toString();
        setTotalUsage(limitStr);
        setError(null);
        return limitStr;
      } catch (err) {
        console.error('Error fetching quota Limit:', err);
        setTotalUsage('0');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError({ message: err?.message || 'Error fetching quota Limit' });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { totalUsage, loading, error, fetchTotalUsage };
};
