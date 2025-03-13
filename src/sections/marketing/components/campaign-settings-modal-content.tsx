import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Address } from 'viem';
import { ethers } from 'ethers';
import { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, FormControl, DialogActions, LinearProgress } from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";
import NeonPaper from "@src/sections/publication/components/neon-paper-container.tsx";

import { useConfigureCampaign } from '@src/hooks/protocol/use-configure-campaign.ts';
import { useGetPolicyTerms } from '@src/hooks/protocol/use-get-policy-terms.ts';
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { CampaignSettingsModalContentProps } from '@src/sections/marketing/types.ts';

import { ERRORS } from '@notifications/errors.ts';
import { SUCCESS } from '@notifications/success.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global';

// ----------------------------------------------------------------------

const CampaignSettingsModalContent: FC<CampaignSettingsModalContentProps> = (props) => {
  const { onClose, onConfirm, campaignData, } = props;
  const { address, description } = campaignData;

  const [quotaLimit, setQuotaLimit] = useState<number>(NaN);
  const [fundsAmount, setFundsAmount] = useState<number>(NaN);
  const [fundsAllocationAmount, setFundsAllocationAmount] = useState<number>(NaN);

  // This could be get from useAuth hook? view issue #604
  const sessionData = useSelector((state: any) => state.auth.session);
  const { configure, loading: loadingConfigure } = useConfigureCampaign();
  const { terms, loading: loadingTerms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    sessionData?.address as Address
  );

  const RainbowEffect = loadingConfigure ? NeonPaper : Box;
  // Convert the daily price from Wei to MMC (float)
  const dailyPriceInMMC = useMemo((): number => {
    if (!terms?.amount) return 0; // use a Terms type to avoid to much use of safe navigation view issue #604
    return parseFloat(ethers.formatUnits(terms.amount, 18));
  }, [terms]);

  // Calculate how many days of access the fundsAllocationAmount provides
  const daysEquivalent = useMemo((): number => {
    const allocationNum = fundsAllocationAmount || 0;
    return dailyPriceInMMC > 0 ? allocationNum / dailyPriceInMMC : 0;
  }, [fundsAllocationAmount, dailyPriceInMMC]);

  // Validate that each field has a value greater or equal to 1
  const isFormValid = useMemo(() => {
    return (fundsAmount >= 1 && fundsAllocationAmount >= 1 && quotaLimit >= 1);
  }, [fundsAmount, fundsAllocationAmount, quotaLimit]);

  const handleOnConfirm = async () => {
    // Prevent proceeding if form validation fails
    if (!isFormValid) return;

    try {
      // send the conf to blockchain campaign registry
      await configure({
        campaignAddress: address,
        addFundsAmount: fundsAmount,
        fundsAllocationAmount: fundsAllocationAmount,
        quotaLimit: quotaLimit,
      });

      notifySuccess(SUCCESS.CAMPAIGN_CONFIGURED_SUCCESSFULLY);
      onConfirm?.();
    } catch (err) {
      console.error('Error configuring campaign:', err);
      notifyError(ERRORS.CAMPAIGN_CONFIGURATION_ERROR);
    }
  };

  // check if the expected number input is valid
  const isNotValidNumberInput = (value: number): boolean => {
    return value < 1
  }

  const fundsAllocationHelperText = useMemo(() => {
    if (isNotValidNumberInput(fundsAllocationAmount))
      return "Funds allocation must be at least 1."

    if (dailyPriceInMMC > 0 && fundsAllocationAmount > 0)
      return ` Each user receive this amount of MMC. For example,
      if your daily subscription costs ${dailyPriceInMMC} MMC/day,
      an allocation of ${fundsAllocationAmount || 0} MMC would provide
      ${daysEquivalent.toFixed(1)} days of access.`;


    return "Maximum amount of MMC a user can receive per access.";
  }, [fundsAllocationAmount, dailyPriceInMMC, daysEquivalent]);


  return (
    <>
      {loadingTerms && <LinearProgress sx={{ mb: 2 }} />}

      <Typography variant="body2" color="text.secondary" sx={{ px: 3 }}>
        Set the total budget and how users can benefit from this campaign.
      </Typography>

      <Divider sx={{ padding: '0.3rem 0', mb: 4, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <Typography variant="body1" color="text.primary" sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
          {description || 'No description provided for this campaign.'}
        </Typography>

        {/* Total Funds Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Total budget"
            type="number"
            name="addFundsAmount"
            value={fundsAmount}
            onChange={(e) => setFundsAmount(Number(e.target.value))}
            placeholder="e.g. 1000"
            error={isNotValidNumberInput(fundsAmount)}
            helperText={isNotValidNumberInput(fundsAmount)
              ? "Total budget must be at least 1."
              : "Total amount of MMC allocated to this campaign."
            }
          />
        </FormControl>

        {/* Funds Allocation Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Allocation per user"
            type="number"
            name="fundsAllocationAmount"
            InputProps={{ inputProps: { min: 1 } }}
            value={fundsAllocationAmount}
            onChange={(e) => setFundsAllocationAmount(Number(e.target.value))}
            placeholder="e.g. 7"
            error={isNotValidNumberInput(fundsAllocationAmount)}
            helperText={fundsAllocationHelperText}
          />
        </FormControl>

        {/* Quota Limit Input */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            label="Access limit per User"
            type="number"
            name="quotaLimit"
            value={quotaLimit}
            InputProps={{ inputProps: { min: 1 } }}
            onChange={(e) => setQuotaLimit(Number(e.target.value))}
            placeholder="e.g. 1"
            error={isNotValidNumberInput(quotaLimit)}
            helperText={isNotValidNumberInput(quotaLimit)
              ? "Access limit must be at least 1."
              : "Maximum number of times a user can benefit from this campaign."
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
