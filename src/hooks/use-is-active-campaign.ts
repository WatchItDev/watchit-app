import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient';
import SubscriptionCampaignAbi from '@src/config/abi/SubscriptionCampaign.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useSelector } from 'react-redux';

interface IsActiveCampaignError {
  message: string;
  code?: number;
  [key: string]: any;
}

interface UseIsActiveCampaignHook {
  isActive?: boolean;
  loading: boolean;
  error?: IsActiveCampaignError | null;
  refetch: () => void;
}

export const useIsActiveCampaign = (ownerAddress?: Address): UseIsActiveCampaignHook => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;

  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<IsActiveCampaignError | null>(null);

  const fetchIsActive = useCallback(async () => {
    if (!userAddress || !ownerAddress) {
      setLoading(false);
      setError({ message: 'User address or owner address is missing.' });
      return;
    }

    setLoading(true);
    try {
      const activeData: any = await publicClient.readContract({
        address: GLOBAL_CONSTANTS.SUBSCRIPTION_CAMPAIGN_ADDRESS,
        abi: SubscriptionCampaignAbi.abi,
        functionName: 'isActiveCampaign',
        args: [ownerAddress, GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
      });

      console.log('is active campaign')
      console.log(activeData)

      const access = Boolean(activeData?.[0]);
      setIsActive(access);
      setError(null);
    } catch (err: any) {
      console.error('Error checking access:', err);
      setIsActive(undefined);
      setError({ message: err?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }, [userAddress, ownerAddress]);

  useEffect(() => {
    fetchIsActive();
  }, [fetchIsActive]);

  const refetch = useCallback(() => {
    fetchIsActive();
  }, [fetchIsActive]);

  if (!userAddress) {
    return {
      isActive: false,
      loading: false,
      error: null,
      refetch: () => {},
    };
  }

  return {
    isActive,
    loading,
    error,
    refetch,
  };
};
