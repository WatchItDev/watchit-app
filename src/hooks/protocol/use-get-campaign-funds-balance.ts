import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { publicClient } from '@src/clients/viem/publicClient.ts';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { HasAccessError, UseGetCampaignFundsBalanceHook } from '@src/hooks/protocol/types.ts';

export const useGetCampaignFundsBalance = (): UseGetCampaignFundsBalanceHook => {
  const [fundsBalance, setFundsBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);

  const fetchCampaignFundsBalance = useCallback(
    async (
      campaignAddress: Address
    ): Promise<bigint> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return 0n;
      }
      setLoading(true);
      try {
        const balance: bigint = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getFundsBalance',
        }) as bigint;
        setFundsBalance(balance);
        setError(null);
        return balance;
      } catch (err: any) {
        console.error('Error fetching funds balance:', err);
        setFundsBalance(0n);
        setError({ message: err?.message || 'Error fetching funds balance.' });
        return 0n;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fundsBalance, loading, error, fetchCampaignFundsBalance };
};
