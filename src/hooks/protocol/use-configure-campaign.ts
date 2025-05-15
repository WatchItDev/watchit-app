import { useState } from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import SubscriptionCampaignTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { useAccountSession } from '@src/hooks/use-account-session.ts';
import {ConfigureCampaignParams, ConfigureCampaignResult, UseConfigureCampaignHook} from '@src/hooks/protocol/types.ts'
import { notifyError } from '@src/libs/notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth.ts';
import { Calls, WaitForUserOperationReceiptReturnType } from '@src/hooks/types.ts'

export const useConfigureCampaign = (): UseConfigureCampaignHook => {
  const [data, setData] = useState<ConfigureCampaignResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { bundlerClient, smartAccount } = useWeb3Auth();
  const { logout } = useAccountSession();
  const { session } = useAuth();

  /**
   * Main function to configure the campaign.
   * Calls addFunds, setFundsAllocation, and setMaxRateLimit on the specified campaign contract.
   */
  const configure = async (props: ConfigureCampaignParams) => {
    const { campaignAddress, addFundsAmount, fundsAllocationAmount, quotaLimit } = props;
    const weiAmount = parseUnits(addFundsAmount.toString(), 18);
    const weiAllocation = parseUnits(fundsAllocationAmount.toString(), 18);

    setLoading(true);

    if (!session.authenticated) {
      notifyError(ERRORS.FIRST_LOGIN_ERROR);
      logout();
      setLoading(false);
      throw new Error('Invalid Web3Auth session');
    }

    try {
      // Prepare the data for each contract call
      const approveFundsData = encodeFunctionData({
        abi: LedgerVaultAbi.abi,
        functionName: 'approve',
        args: [campaignAddress, weiAmount, GLOBAL_CONSTANTS.MMC_ADDRESS],
      });

      const addFundsData = encodeFunctionData({
        abi: SubscriptionCampaignTplAbi.abi,
        functionName: 'addFunds',
        args: [weiAmount],
      });

      const setFundsAllocationData = encodeFunctionData({
        abi: SubscriptionCampaignTplAbi.abi,
        functionName: 'setFundsAllocation',
        args: [weiAllocation, GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
      });

      const setMaxRateLimitData = encodeFunctionData({
        abi: SubscriptionCampaignTplAbi.abi,
        functionName: 'setQuotaLimit',
        args: [quotaLimit],
      });

      // Group the calls to send them in a single user operation
      const calls: Calls = [
        {
          to: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
          value: 0,
          data: approveFundsData,
        },
        {
          to: campaignAddress,
          value: 0,
          data: addFundsData,
        },
        {
          to: campaignAddress,
          value: 0,
          data: setFundsAllocationData,
        },
        {
          to: campaignAddress,
          value: 0,
          data: setMaxRateLimitData,
        },
      ];

      // Send the UserOperation to our bundler
      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
      });

      // Wait for the transaction receipt
      const receipt: WaitForUserOperationReceiptReturnType = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData(receipt);
      setLoading(false);
    } catch (err) {
      console.error('USE CONFIGURE CAMPAIGN ERR:', err);
      notifyError(ERRORS.CONFIGURE_CAMPAIGN_ERROR);
      setLoading(false);
    }
  };

  return { data, configure, loading };
};
