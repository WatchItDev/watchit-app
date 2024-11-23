// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Paper,
  Divider,
} from '@mui/material';

// ETHERS IMPORTS
import { ethers } from 'ethers';

// VIEM IMPORTS
import { Address } from 'viem';

// LOCAL IMPORTS
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSubscribe } from '@src/hooks/use-subscribe.ts';
import { Profile } from '@lens-protocol/api-bindings';

// ----------------------------------------------------------------------

type SubscribeProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  profile: Profile;
};

// ----------------------------------------------------------------------

export const SubscribeProfileModal = ({
                                        isOpen,
                                        onClose,
                                        profile,
                                        onSubscribe,
                                      }: SubscribeProfileModalProps) => {
  // Hardcoded daily cost in Wei (BigInt with 18 decimals)
  const DAILY_COST_WEI = ethers.parseUnits('1.75', 18); // 1.75 MMC in Wei

  const [selectedDuration, setSelectedDuration] = useState('7');
  const [customDuration, setCustomDuration] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data, error, loading, subscribe } = useSubscribe();

  const durationOptions = [
    { value: '7', title: '1 Week' },
    { value: '15', title: '15 Days' },
    { value: '30', title: '1 Month' },
  ];

  useEffect(() => {
    if (error) setErrorMessage(error.shortMessage ?? error.message);
  }, [error]);

  useEffect(() => {
    if (data?.receipt) {
      setSuccessMessage('Successfully subscribed to the profile.');
      onSubscribe?.();
    }
  }, [data]);

  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
    setCustomDuration('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCustomDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedDuration('');
    setCustomDuration(event.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubscribe = async () => {
    const duration = customDuration || selectedDuration;
    if (!duration) {
      return;
    }

    const durationDays = parseInt(duration);

    if (isNaN(durationDays) || durationDays < 7) {
      setErrorMessage('Please enter a valid number of days (minimum 7 days).');
      return;
    }

    try {
      // Calculate total cost in Wei: DAILY_COST_WEI * durationDays
      const totalCostWei = DAILY_COST_WEI * BigInt(durationDays);

      // Convert total cost to MMC tokens as a string
      const totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Converts Wei to MMC

      // Subscribe using the amount in tokens (as a string)
      await subscribe({
        holderAddress: profile?.ownedBy?.address as Address,
        amount: totalCostMMC,
      }); // amount is now in MMC tokens as a string

      setSuccessMessage('Subscription activated successfully!');
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to activate subscription.');
    }
  };

  // Calculate total cost in MMC for display (convert from Wei)
  const duration = customDuration || selectedDuration || '0';
  const durationDays = parseInt(duration);
  const minDays = 7;
  const isCustomDurationInvalid =
    customDuration && (isNaN(durationDays) || durationDays < minDays);

  let totalCostMMC = '0.00';
  if (!isCustomDurationInvalid && durationDays >= minDays) {
    const totalCostWei = DAILY_COST_WEI * BigInt(durationDays);
    totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Convert Wei to MMC
  }

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 2 }}>Subscribe to Profile</DialogTitle>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <DialogContent>
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Select the duration of your subscription.
          </Typography>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              {durationOptions.map((option) => (
                <Paper
                  key={option.value}
                  onClick={() => handleDurationChange(option.value)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    width: '33%',
                    backgroundColor: 'transparent',
                    opacity: selectedDuration === option.value ? 1 : 0.4,
                    border:
                      selectedDuration === option.value
                        ? '2px solid rgba(255,255,255,0.3)'
                        : '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {option.title}
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <TextField
              type="number"
              placeholder="Enter custom days (min 7 days)"
              fullWidth
              value={customDuration}
              onChange={handleCustomDurationChange}
              InputProps={{
                inputProps: { min: 7 },
              }}
            />
          </Stack>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 1 }}
            >
              Total Cost:
            </Typography>
            {!isCustomDurationInvalid && durationDays >= minDays ? (
              <Stack
                spacing={0}
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  flexGrow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">{totalCostMMC} MMC</Typography>
                <Typography variant="body2" color="textSecondary">
                  for {durationDays} days
                </Typography>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1 }}
              >
                Please enter a valid number of days (minimum {minDays} days).
              </Typography>
            )}
          </Stack>

          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mt: 2 }}
            >
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <Divider sx={{ mt: 3, borderStyle: 'dashed' }} />
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleSubscribe}
            disabled={
              loading ||
              (!selectedDuration && !customDuration) ||
              !!isCustomDurationInvalid
            }
            loading={loading}
          >
            Subscribe
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200 }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200 }}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
