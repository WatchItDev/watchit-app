import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { UseCampaignUnPauseHook } from '@src/hooks/protocol/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

export const useCampaignUnPause = (): UseCampaignUnPauseHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { logout } = useAccountSession();
  const { isFullyAuthenticated: isAuthenticated } = useAuth();

  const unPause = async (campaignAddress: string): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const unPauseData = encodeFunctionData({
        abi: CampaignSubscriptionTplAbi.abi,
        functionName: 'unpause',
        args: [],
      });

      const calls = [
        {
          to: campaignAddress,
          value: 0,
          data: unPauseData,
        },
      ];

      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      setData(receipt);
    } catch (err: any) {
      console.error('Error in unPause:', err);
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { data, unPause, loading, error };
};
