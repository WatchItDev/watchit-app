import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import AccessWorkflowAbi from '@src/config/abi/AccessWorkflow.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import { SponsoredAccessParams, UseSponsoredAccessAgreementHook } from '@src/hooks/protocol/types.ts';

export const useSponsoredAccessAgreement = (): UseSponsoredAccessAgreementHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  const sponsoredAccessAgreement = async ({
                                            holder,
                                            campaignAddress,
                                            policyAddress,
                                            parties,
                                            payload
                                          }: SponsoredAccessParams) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      const sponsoredAccessData = encodeFunctionData({
        abi: AccessWorkflowAbi.abi,
        functionName: 'sponsoredAccessAgreement',
        args: [
          holder,
          campaignAddress,
          policyAddress,
          parties,
          payload
        ],
      });

      const calls = [
        {
          to: GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS,
          value: 0,
          data: sponsoredAccessData,
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
      console.error('USE SPONSORED ACCESS AGREEMENT ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, sponsoredAccessAgreement, loading, error };
};
