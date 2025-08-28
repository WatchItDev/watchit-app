import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import {
  HasAccessError,
  UseGetCampaignIsReadyHook,
} from '@src/hooks/protocol/types.ts';

export const useGetCampaignIsReady = (): UseGetCampaignIsReadyHook => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchIsReady = useCallback(
    async (campaignAddress: Address): Promise<string | undefined> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return undefined;
      }
      setLoading(true);
      try {
        const ready = (await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'isReady',
          args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
        })) as boolean;
        setIsReady(ready);
        setError(null);
        return ready ? 'true' : 'false';
      } catch (err) {
        console.error('Error fetching is Ready:', err);
        setIsReady(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError({ message: err?.message || 'Error fetching is Ready' });
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { isReady, loading, error, fetchIsReady };
};
