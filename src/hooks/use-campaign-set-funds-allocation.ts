import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Address, encodeFunctionData } from 'viem';
import CampaignSubscriptionTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import { useWeb3Session } from '@src/hooks/use-web3-session';
import { ERRORS } from '@notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session';

export interface CampaignSetFundsAllocationParams {
  campaignAddress: Address;
  amount: number;
  operator: Address;
}

export interface UseCampaignSetFundsAllocationHook {
  data?: any;
  setFundsAllocation: (params: CampaignSetFundsAllocationParams) => Promise<void>;
  loading: boolean;
  error: keyof typeof ERRORS | null;
}

export const useCampaignSetFundsAllocation = (): UseCampaignSetFundsAllocationHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  const setFundsAllocationFn = async ({
                                         campaignAddress,
                                         amount,
                                         operator,
                                       }: CampaignSetFundsAllocationParams): Promise<void> => {
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
      const setFundsAllocationData = encodeFunctionData({
        abi: CampaignSubscriptionTplAbi.abi,
        functionName: 'setFundsAllocation',
        args: [amount, operator],
      });

      const calls = [
        {
          to: campaignAddress,
          value: 0,
          data: setFundsAllocationData,
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
      console.error('Error in setFundsAllocation:', err);
      setError(ERRORS.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { data, setFundsAllocation: setFundsAllocationFn, loading, error };
};
