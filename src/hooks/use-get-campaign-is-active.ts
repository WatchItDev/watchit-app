import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';

interface HasAccessError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface UseGetCampaignIsActiveHook {
  isActive: boolean;
  loading: boolean;
  error: HasAccessError | null;
  fetchIsActive: (
    campaignAddress: Address,
    account: Address
  ) => Promise<string | undefined>;
}

export const useGetCampaignIsActive = (): UseGetCampaignIsActiveHook => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);
  const sessionData = useSelector((state: any) => state.auth.session);

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
          // args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS, account],
          args: ['0xbB97F1234282ff8f74c7d091CB2eDC4F82A311C0', account],
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
