import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Address, encodeFunctionData, parseUnits } from 'viem';
import SubscriptionCampaignTplAbi from '@src/config/abi/CampaignSubscriptionTpl.json';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useWeb3Session } from '@src/hooks/use-web3-session.ts';
import { ERRORS } from '@notifications/errors.ts';
import { useAccountSession } from '@src/hooks/use-account-session.ts';

interface ConfigureCampaignParams {
  campaignAddress: Address;           // Address of the campaign contract to configure
  addFundsAmount: number;   // Amount to fund in addFunds
  fundsAllocationAmount: number;  // Amount for setFundsAllocation
  quotaLimit: number;           // Max rate limit for setMaxRateLimit
}

interface UseConfigureCampaignHook {
  data?: any;
  configure: (params: ConfigureCampaignParams) => Promise<void>;
  loading: boolean;
  error?: keyof typeof ERRORS | null;
}

export const useConfigureCampaign = (): UseConfigureCampaignHook => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);

  // Session data (same as in your original hook)
  const sessionData = useSelector((state: any) => state.auth.session);
  const { bundlerClient, smartAccount } = useWeb3Session();
  const { isAuthenticated, logout } = useAccountSession();

  /**
   * Main function to configure the campaign.
   * Calls addFunds, setFundsAllocation, and setMaxRateLimit on the specified campaign contract.
   */
  const configure = async ({
                             campaignAddress,
                             addFundsAmount,
                             fundsAllocationAmount,
                             quotaLimit
                           }: ConfigureCampaignParams) => {
    const weiAmount = parseUnits(addFundsAmount.toString(), 18);

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

    console.log('configura campaign data')
    console.log(addFundsAmount)
    console.log(weiAmount)
    console.log(campaignAddress)

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
        args: [fundsAllocationAmount, GLOBAL_CONSTANTS.ACCESS_WORKFLOW_ADDRESS],
      });

      const setMaxRateLimitData = encodeFunctionData({
        abi: SubscriptionCampaignTplAbi.abi,
        functionName: 'setQuotaLimit',
        args: [quotaLimit],
      });


      // Group the calls to send them in a single user operation
      const calls = [
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
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      setData(receipt);
      setLoading(false);
    } catch (err: any) {
      console.error('USE CONFIGURE CAMPAIGN ERR:', err);
      setError(ERRORS.UNKNOWN_ERROR);
      setLoading(false);
    }
  };

  return { data, configure, loading, error };
};
