import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import AccessWorkflowAbi from '@src/config/abi/AccessWorkflow.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import {
  SponsoredAccessAgreementDetailsReturn,
  SponsoredAccessParams,
  UseSponsoredAccessAgreementHook
} from '@src/hooks/protocol/types.ts'
import { notifyError } from '@src/libs/notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls, WaitForUserOperationReceiptReturnType } from '@src/hooks/types.ts'

export const useSponsoredAccessAgreement = (): UseSponsoredAccessAgreementHook => {
  const [data, setData] = useState<SponsoredAccessAgreementDetailsReturn | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { session } = useAuth();

  const sponsoredAccessAgreement = async (props: SponsoredAccessParams) => {
    const { holder, campaignAddress, policyAddress, parties, payload } = props;
    setLoading(true);

    if (!session.authenticated) {
      notifyError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      console.log('sponsoredAccessAgreement props:', props);
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

      const calls: Calls = [
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

      const receipt: WaitForUserOperationReceiptReturnType = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData(receipt);

      console.log('Sponsored Access Agreement Receipt:', receipt);

      setLoading(false);
    } catch (err) {
      console.error('USE SPONSORED ACCESS AGREEMENT ERR:', err);
      notifyError(ERRORS.SPONSORED_ACCESS_ERROR);
      setLoading(false);
    }
  };

  return { data, sponsoredAccessAgreement, loading };
};
