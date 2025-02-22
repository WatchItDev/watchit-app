import { FC, useState, useMemo, useEffect } from 'react';
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
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';
import { SUCCESS } from '@notifications/success.ts';

interface CampaignSettingsModalContentProps {
  onClose?: () => void;
  onConfirm?: () => void;
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

  const [addFundsAmount, setAddFundsAmount] = useState<string>('');
  const [fundsAllocationAmount, setFundsAllocationAmount] = useState<string>('');
  const [quotaLimit, setQuotaLimit] = useState<string>('');

  // Get session data from Redux
  const sessionData = useSelector((state: any) => state.auth.session);
  const { terms, loading: loadingTerms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    sessionData?.address as Address
  );
  const { configure, loading: loadingConfigure, error } = useConfigureCampaign();

  useEffect(() => {
    if (error) notifyError(ERRORS.CAMPAIGN_CONFIGURATION_ERROR);
  }, [error]);

  // Convert the daily price from Wei to MMC (float)
  const dailyPriceInMMC = useMemo(() => {
    if (!terms?.amount) return 0;
    return parseFloat(ethers.formatUnits(terms.amount, 18));
  }, [terms]);

  // Calculate how many days of access the fundsAllocationAmount provides
  const daysEquivalent = useMemo(() => {
    const allocationNum = parseFloat(fundsAllocationAmount) || 0;
    return dailyPriceInMMC > 0 ? allocationNum / dailyPriceInMMC : 0;
  }, [fundsAllocationAmount, dailyPriceInMMC]);

  // Validate that each field has a value greater or equal to 1
  const isFormValid = useMemo(() => {
    return (
      Number(addFundsAmount) >= 1 &&
      Number(fundsAllocationAmount) >= 1 &&
      Number(quotaLimit) >= 1
    );
  }, [addFundsAmount, fundsAllocationAmount, quotaLimit]);

  const handleOnConfirm = async () => {
    // Prevent proceeding if form validation fails
    if (!isFormValid) {
      console.error("Validation failed. Please check the input fields.");
      return;
    }

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

      notifySuccess(SUCCESS.CAMPAIGN_CONFIGURED_SUCCESSFULLY);

      onConfirm?.();
    } catch (err) {
      console.error('Error configuring campaign:', err);
    }
  };

  const RainbowEffect = loadingConfigure ? NeonPaper : Box;

  return (
    <>
      {loadingTerms && <LinearProgress sx={{ mb: 2 }} />}

      <Typography variant="body2" color="text.secondary" sx={{ px: 3 }}>
        This will help define how much each user receives and how many times they can access your subscription.
      </Typography>

      <Divider sx={{ padding: '0.3rem 0', mb: 4, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
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
            error={addFundsAmount !== '' && Number(addFundsAmount) < 1}
            helperText={
              addFundsAmount !== '' && Number(addFundsAmount) < 1
                ? "Total Funds must be at least 1."
                : "The total amount of MMC you want to allocate to this campaign."
            }
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
            error={fundsAllocationAmount !== '' && Number(fundsAllocationAmount) < 1}
            helperText={
              fundsAllocationAmount !== '' && Number(fundsAllocationAmount) < 1
                ? "Funds allocation must be at least 1."
                : dailyPriceInMMC > 0
                  ? `Each user can claim this amount of MMC. For example, if your daily subscription costs ${dailyPriceInMMC} MMC/day, an allocation of ${fundsAllocationAmount || 0} MMC would provide ${daysEquivalent.toFixed(2)} days of access.`
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
            error={quotaLimit !== '' && Number(quotaLimit) < 1}
            helperText={
              quotaLimit !== '' && Number(quotaLimit) < 1
                ? "Maximum claims must be at least 1."
                : "Number of times a user can claim this campaign (must be at least 1)."
            }
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
            disabled={loadingConfigure || loadingTerms || !isFormValid}
            loading={loadingConfigure || loadingTerms}
          >
            Confirm
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export default CampaignSettingsModalContent;
