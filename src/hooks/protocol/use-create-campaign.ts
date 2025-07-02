import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import CampaignRegistryAbi from '@src/config/abi/CampaignRegistry.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import {CreateCampaignParams, CreateCampaignResult, UseCreateCampaignHook} from '@src/hooks/protocol/types.ts'
import { notifyError } from '@src/libs/notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls } from '@src/hooks/types.ts'

export const useCreateCampaign = (): UseCreateCampaignHook => {
  const [data, setData] = useState<CreateCampaignResult |null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { sendOperation } = useWeb3Auth();
  const { session } = useAuth();

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

    if (!session.authenticated) {
      notifyError(ERRORS.FIRST_LOGIN_ERROR);
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const campaignData = initializeCampaign({ policy, expiration, description });

      const calls: Calls = [
        {
          to: GLOBAL_CONSTANTS.CAMPAIGN_REGISTRY_ADDRESS,
          value: 0,
          data: campaignData,
        },
      ];

      const receipt = await sendOperation(calls);

      setData(receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE CREATE CAMPAIGN ERR:', err);
      notifyError(ERRORS.CAMPAIGN_CREATION_ERROR)
      setLoading(false);
    }
  };

  return { data, create, loading };
};
