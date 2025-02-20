import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Address, encodeFunctionData } from 'viem';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { useWeb3Session } from '@src/hooks/use-web3-session';
import { ERRORS } from '@notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session';

export interface CampaignRunParams {
  campaignAddress: Address;
  sponsor: Address;
  account: Address;
}

export interface UseCampaignRunHook {
  data?: any;
  run: (params: CampaignRunParams) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}

export const useCampaignRun = (): UseCampaignRunHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  const run = async ({
                       campaignAddress,
                       sponsor,
                       account,
                     }: CampaignRunParams): Promise<void> => {
    setLoading(true);
    setError(null);

    // Session checks
    if (!sessionData?.authenticated) {
      setError(ERRORS.TRANSFER_LOGIN_FIRST_ERROR);
      setLoading(false);
      return;
    }
    if (!isAuthenticated()) {
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const runData = encodeFunctionData({
        abi: CampaignSubscriptionTplAbi.abi,
        functionName: 'run',
        args: [sponsor, account],
      });

      const calls = [
        {
          to: campaignAddress,
          value: 0,
          data: runData,
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
      console.error('Error in run:', err);
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { data, run, loading, error };
};
