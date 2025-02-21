import { useState } from 'react';
import { useSelector } from 'react-redux';
import { encodeFunctionData } from 'viem';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';

interface CreateCampaignParams {
  policy: string;
  expiration: number;
  description: string;
}

interface UseCreateCampaignHook {
  data?: any;
  create: (params: CreateCampaignParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export const useCreateCampaign = (): UseCreateCampaignHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  const initializeCampaign = ({ policy, expiration, description }: CreateCampaignParams) => {
    return encodeFunctionData({
      abi: CampaignRegistryAbi.abi,
      functionName: 'createCampaign',
      args: [
        GLOBAL_CONSTANTS.CAMPAIGN_SUBSCRIPTION_TPL_ADDRESS, // TEMPLATE
        policy, // POLICY ADDRESS
        expiration, // EXPIRATION IN SECONDS
        description // DESCRIPTION
      ],
    });
  };

  const create = async ({ policy, expiration, description }: CreateCampaignParams) => {
    setLoading(true);
    setError(null);

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

    console.log('hello create')
    console.log(policy)
    console.log(expiration)
    console.log(description)

    try {
      const campaignData = initializeCampaign({ policy, expiration, description });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS,
          value: 0,
          data: campaignData,
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
      setLoading(false);
    } catch (err: any) {
      console.error('USE CREATE CAMPAIGN ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, create, loading, error };
};
