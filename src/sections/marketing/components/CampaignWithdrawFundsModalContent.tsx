// REACT IMPORTS
import { FC, useState } from 'react';

// MUI IMPORTS
import { DialogActions, Divider, Button, TextField, FormControl, Grid, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";

// VIEM IMPORTS
import { parseUnits } from 'viem';

// LOCAL IMPORTS
import { useCampaignRemoveFunds } from '@src/hooks/protocol/use-campaign-remove-funds.ts';
import NeonPaper from "@src/sections/publication/NeonPaperContainer";
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { ERRORS } from '@notifications/errors.ts';
import { SUCCESS } from '@notifications/success.ts';
import { CampaignWithdrawFundsModalContentProps } from '@src/sections/marketing/components/types.ts';

const CampaignWithdrawFundsModalContent: FC<CampaignWithdrawFundsModalContentProps> = (props) => {
  const { campaignData, onClose, onConfirm } = props;
  const { address, description, currentFundsBalance } = campaignData;
  const { removeFunds, loading } = useCampaignRemoveFunds();
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const canWithdraw = Number(withdrawAmount) > 0 && Number(withdrawAmount) <= Number(currentFundsBalance);

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    const amountInWei = parseUnits(withdrawAmount, 18);

    try {
      await removeFunds({
        campaignAddress: address,
        amount: amountInWei,
      });
      notifySuccess(SUCCESS.CAMPAIGN_WITHDRAWN_SUCCESSFULLY);
      onConfirm();
    } catch (err) {
      console.error('Error withdrawing funds => ', err);
      notifyError(ERRORS.CAMPAIGN_WITHDRAWAL_ERROR)
    }
  };

  const RainbowEffect = loading ? NeonPaper : Box;

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ px: 3 }}>
        Remove unused funds from your campaign. Make sure you don't leave the campaign without funds if it's still active.
      </Typography>

      <Divider sx={{ padding: '0.3rem 0', mb: 4, borderStyle: 'dashed' }} />

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
          {description || 'No description available.'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1, width: '100%' }}>
          Current Campaign Balance: <strong>{Number(currentFundsBalance).toFixed(2)} MMC</strong>
        </Typography>

        <FormControl fullWidth>
          <TextField
            label="Amount to withdraw (MMC)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            error={!!withdrawAmount && !canWithdraw}
            helperText={
              !canWithdraw && withdrawAmount
                ? `Please enter a valid amount (1 - ${currentFundsBalance}).`
                : 'Specify the amount of MMC you wish to remove from this campaign.'
            }
          />
        </FormControl>
      </Grid>

      <Divider sx={{ padding: '0.3rem 0', borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <RainbowEffect
          {...(loading && {
            borderRadius: '10px',
            animationSpeed: '3s',
            padding: '0',
            width: 'auto',
          })}
        >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleWithdraw}
            disabled={loading || !canWithdraw}
            loading={loading}
          >
            Withdraw
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export default CampaignWithdrawFundsModalContent;
