import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import {
  UseCampaignPauseHook,
  UseCampaignPauseResult,
} from '@src/hooks/protocol/types.ts';
import { Calls } from '@src/hooks/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';

export const useCampaignPause = (): UseCampaignPauseHook => {
  const [data, setData] = useState<UseCampaignPauseResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { sendOperation } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { session } = useAuth();

  const pause = async (campaignAddress: string): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!session.authenticated) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const pauseData = encodeFunctionData({
        abi: CampaignSubscriptionTplAbi.abi,
        functionName: 'pause',
        args: [],
      });

      const calls: Calls = [
        {
          to: campaignAddress,
          value: 0,
          data: pauseData,
        },
      ];

      const receipt = await sendOperation(calls);

      setData(receipt);
    } catch (err) {
      console.error('Error in pause:', err);
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { data, pause, loading, error };
};
