import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { CreateCampaignParams, UseCreateCampaignHook } from '@src/hooks/protocol/types.ts';
import { notifyError } from '@notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

export const useCreateCampaign = (): UseCreateCampaignHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isFullyAuthenticated: isAuthenticated } = useAuth();

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

    if (!isAuthenticated) {
      notifyError(ERRORS.FIRST_LOGIN_ERROR);
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

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
      notifyError(ERRORS.CAMPAIGN_CREATION_ERROR)
      setLoading(false);
    }
  };

  return { data, create, loading };
};
