import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { UseCampaignPausedHook, HasAccessError } from '@src/hooks/protocol/types.ts';

export const useCampaignPaused = (): UseCampaignPausedHook => {
  const [paused, setPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchCampaignPaused = useCallback(
    async (campaignAddress: Address): Promise<boolean> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return false;
      }
      setLoading(true);
      try {
        const isPaused: boolean = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'paused',
          args: [],
        }) as boolean;
        setPaused(isPaused);
        setError(null);
        return isPaused;
      } catch (err: any) {
        console.error('Error fetching paused state:', err);
        setPaused(false);
        setError({ message: err?.message || 'Error fetching paused state.' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { paused, loading, error, fetchCampaignPaused };
};
