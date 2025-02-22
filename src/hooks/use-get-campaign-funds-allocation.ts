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

export interface UseGetCampaignFundsAllocationHook {
  fundsAllocation: string;
  loading: boolean;
  error: HasAccessError | null;
  fetchFundsAllocation: (
    campaignAddress: Address
  ) => Promise<string | undefined>;
}

export const useGetCampaignFundsAllocation = (): UseGetCampaignFundsAllocationHook => {
  const [fundsAllocation, setFundsAllocation] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HasAccessError | null>(null);
  const sessionData = useSelector((state: any) => state.auth.session);

  const fetchFundsAllocation = useCallback(
    async (
      campaignAddress: Address,
    ): Promise<string | undefined> => {
      if (!campaignAddress) {
        setError({ message: 'Campaign address is missing.' });
        return;
      }
      setLoading(true);
      try {
        const allocation: bigint = await publicClient.readContract({
          address: campaignAddress,
          abi: CampaignSubscriptionTplAbi.abi,
          functionName: 'getFundsAllocation',
          // args: [GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
          args: ['0x61Cad4F0fd9F93482095b4882111f953e563b404'],
        }) as bigint;
        const allocationStr = allocation.toString();
        setFundsAllocation(allocationStr);
        setError(null);
        return allocationStr;
      } catch (err: any) {
        console.error('Error fetching funds allocation:', err);
        setFundsAllocation('0');
        setError({ message: err?.message || 'Error fetching funds allocation.' });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fundsAllocation, loading, error, fetchFundsAllocation };
};
