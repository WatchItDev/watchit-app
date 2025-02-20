import { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, TextField, FormControl, DialogActions, LinearProgress } from '@mui/material';
import { ethers } from 'ethers';
import { Address } from 'viem';

import { useConfigureCampaign } from '@src/hooks/use-configure-campaign';
import { useGetPolicyTerms } from '@src/hooks/use-get-policy-terms';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

interface CampaignSettingsModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
  campaignData: {
    address: Address;
    description: string;
  };
}

const CampaignSettingsModalContent: FC<CampaignSettingsModalContentProps> = ({
                                                                               onClose,
                                                                               onConfirm,
                                                                               campaignData,
                                                                             }) => {
  const { address, description } = campaignData;

  // Local states for each input field
  const [addFundsAmount, setAddFundsAmount] = useState<string>('');
  const [fundsAllocationAmount, setFundsAllocationAmount] = useState<string>('');
  const [quotaLimit, setQuotaLimit] = useState<string>('');

  // Grab session data from Redux (adjust this path as needed)
  const sessionData = useSelector((state: any) => state.auth.session);

  // 1. Use the hook to get the subscription terms (and thus the daily price in Wei)
  const { terms, loading: loadingTerms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    sessionData?.address as Address
  );

  // 2. Convert the daily price from Wei to a float in MMC
  const dailyPriceInMMC = useMemo(() => {
    if (!terms?.amount) return 0;
    return parseFloat(ethers.formatUnits(terms.amount, 18)); // Wei -> MMC
  }, [terms]);

  // 3. Calculate how many days of access the fundsAllocationAmount would provide,
  //    based on the dailyPriceInMMC
  const daysEquivalent = useMemo(() => {
    const allocationNum = parseFloat(fundsAllocationAmount) || 0;
    return dailyPriceInMMC > 0 ? allocationNum / dailyPriceInMMC : 0;
  }, [fundsAllocationAmount, dailyPriceInMMC]);

  // Custom hook to configure the campaign
  const { configure, loading: loadingConfigure } = useConfigureCampaign();

  /**
   * Main handler for confirming the campaign configuration.
   * Converts string values to numbers and calls our configure function.
   */
  const handleOnConfirm = async () => {
    try {
      const numericAddFundsAmount = Number(addFundsAmount);
      const numericFundsAllocationAmount = Number(fundsAllocationAmount);
      const numericQuotaLimit = Number(quotaLimit);

      await configure({
        campaignAddress: address,
        addFundsAmount: numericAddFundsAmount,
        fundsAllocationAmount: numericFundsAllocationAmount,
        quotaLimit: numericQuotaLimit,
      });

      onConfirm();
    } catch (err) {
      console.error('Error configuring campaign:', err);
    }
  };

  const RainbowEffect = loadingConfigure ? NeonPaper : Box;

  return (
    <>
      {/* Loading spinner for terms, if needed */}
      {loadingTerms && <LinearProgress sx={{ mb: 2 }} />}

      {/* Descriptive text at the top */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        Configure your campaign by specifying the total funds, the amount each user can claim,
        and how many times a user is allowed to claim.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        This will help define how much each user receives and how many times they can access
        your subscription.
      </Typography>

      <Divider sx={{ padding: '0.3rem 0', mb: 4, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        {/* Campaign description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {description || 'No description provided for this campaign.'}
        </Typography>

        {/* Total Funds Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Total Funds"
            type="number"
            name="addFundsAmount"
            value={addFundsAmount}
            onChange={(e) => setAddFundsAmount(e.target.value)}
            placeholder="e.g. 1000"
            helperText="The total amount of MMC you want to allocate to this campaign."
          />
        </FormControl>

        {/* Funds Allocation Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Funds Allocation per User"
            type="number"
            name="fundsAllocationAmount"
            value={fundsAllocationAmount}
            onChange={(e) => setFundsAllocationAmount(e.target.value)}
            placeholder="e.g. 7"
            helperText={
              dailyPriceInMMC > 0
                ? `Amount of MMC each user can claim. For instance, if the daily subscription
                   costs ${dailyPriceInMMC} MMC/day, then an allocation of ${
                  fundsAllocationAmount || 0
                } MMC would provide ~${daysEquivalent.toFixed(
                  2
                )} days of access.`
                : 'Amount of MMC each user can claim.'
            }
          />
        </FormControl>

        {/* Quota Limit Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Maximum Claims per User"
            type="number"
            name="quotaLimit"
            value={quotaLimit}
            onChange={(e) => setQuotaLimit(e.target.value)}
            placeholder="e.g. 1"
            helperText="Number of times a user can claim this campaign (must be at least 1)."
          />
        </FormControl>
      </Grid>

      <Divider sx={{ padding: '0.3rem 0', borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <RainbowEffect
          {...(loadingConfigure && {
            borderRadius: '10px',
            animationSpeed: '3s',
            padding: '0',
            width: 'auto',
          })}
        >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleOnConfirm}
            disabled={loadingConfigure || loadingTerms}
            loading={loadingConfigure || loadingTerms}
          >
            {loadingConfigure ? 'Configuring...' : 'Confirm'}
          </LoadingButton>
        </RainbowEffect>

        {/*<Button
          variant="contained"
          onClick={handleOnConfirm}
          disabled={loading}
          sx={{ backgroundColor: 'white', color: 'black' }}
        >

        </Button>*/}
      </DialogActions>
    </>
  );
};

export default CampaignSettingsModalContent;
