import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import {
  CampaignRemoveFundsParams,
  UseCampaignRemoveFundsHook,
  UseCampaignRemoveFundsResult,
} from '@src/hooks/protocol/types.ts';
import { Calls, WaitForUserOperationReceiptReturnType } from '@src/hooks/types.ts'
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';

export const useCampaignRemoveFunds = (): UseCampaignRemoveFundsHook => {
  const [data, setData] = useState<UseCampaignRemoveFundsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { session } = useAuth();

  const removeFunds = async ({
                               campaignAddress,
                               amount,
                             }: CampaignRemoveFundsParams): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!session.authenticated) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const removeFundsData = encodeFunctionData({
        abi: CampaignSubscriptionTplAbi.abi,
        functionName: 'removeFunds',
        args: [amount],
      });

      const calls: Calls = [
        {
          to: campaignAddress,
          value: 0,
          data: removeFundsData,
        },
      ];

      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });
      const receipt: WaitForUserOperationReceiptReturnType = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      setData(receipt);

      console.log('Transaction receipt:', receipt);
    } catch (err) {
      console.error('Error in removeFunds:', err);
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { data, removeFunds, loading, error };
};
