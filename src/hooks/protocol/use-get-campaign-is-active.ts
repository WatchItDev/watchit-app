import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { HasAccessError, UseGetCampaignIsActiveHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaignIsActive = (): UseGetCampaignIsActiveHook => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchIsActive = useCallback(
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
        const active: any = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'isActive',
          args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS, account],
        }) as bigint;
        setIsActive(active);
        setError(null);
        return active;
      } catch (err: any) {
        console.error('Error fetching is active:', err);
        setIsActive(false);
        setError({ message: err?.message || 'Error fetching is active' });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { isActive, loading, error, fetchIsActive };
};
