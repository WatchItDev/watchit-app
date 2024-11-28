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
import { useResolveTerms } from '@src/hooks/use-resolve-terms.ts';
import LinearProgress from '@mui/material/LinearProgress';

import { useBalance } from 'wagmi';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

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
  // State variables for handling durations and messages
  const [selectedDuration, setSelectedDuration] = useState('7');
  const [customDuration, setCustomDuration] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hooks for subscription and terms resolution
  const { data, error, loading, subscribe } = useSubscribe();
  const {
    terms,
    loading: loadingTerms,
  } = useResolveTerms(profile?.ownedBy?.address as Address);

  // Hook to get the user's session data
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();

  // Hook to get the user's balance
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = useBalance({
    address: sessionData?.address,
    token: GLOBAL_CONSTANTS.MMC_ADDRESS,
  });

  // Options for predefined durations
  const durationOptions = [
    { value: '7', title: '1 week' },
    { value: '15', title: '15 days' },
    { value: '30', title: '1 month' },
  ];

  // Effect to handle subscription errors
  useEffect(() => {
    if (error) console.log('Subscribe error: ', error);
    if (error) setErrorMessage(error.shortMessage ?? error.message);
  }, [error]);

  // Effect to handle balance errors
  useEffect(() => {
    if (balanceError) {
      console.log('Error fetching balance: ', balanceError);
      setErrorMessage('Could not retrieve your balance. Please try again later.');
    }
  }, [balanceError]);

  // Effect to handle successful subscription
  useEffect(() => {
    if (data?.receipt) {
      setSuccessMessage('Successfully subscribed to the profile.');
      onSubscribe?.();
      onClose?.();
    }
  }, [data]);

  // Handler for changing the selected duration
  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
    setCustomDuration('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handler for changing the custom duration
  const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDuration('');
    setCustomDuration(event.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Calculate total cost and check if the balance is sufficient
  const duration = customDuration || selectedDuration || '0';
  const durationDays = parseInt(duration);
  const minDays = 7;
  const isCustomDurationInvalid = customDuration && (isNaN(durationDays) || durationDays < minDays);

  let totalCostWei = BigInt(0);
  let totalCostMMC = '0.00';

  if (!isCustomDurationInvalid && durationDays >= minDays && terms?.amount) {
    totalCostWei = terms.amount * BigInt(durationDays);
    totalCostMMC = ethers.formatUnits(totalCostWei, 18); // Convert Wei to MMC
  }

  const isBalanceSufficient = balanceData && totalCostWei && balanceData.value >= totalCostWei;

  // Determine if the subscribe button should be disabled
  const isButtonDisabled =
    loading ||
    (!selectedDuration && !customDuration) ||
    isCustomDurationInvalid ||
    balanceLoading ||
    !isBalanceSufficient;

  // Handler for the subscribe action
  const handleSubscribe = async () => {
    if (!duration) {
      return;
    }

    if (isCustomDurationInvalid) {
      setErrorMessage(`Please enter a valid number of days (minimum ${minDays} days).`);
      return;
    }

    if (!isBalanceSufficient) {
      setErrorMessage('Insufficient balance to complete the subscription.');
      return;
    }

    try {
      // Proceed with the subscription using the calculated amount
      await subscribe({
        holderAddress: profile?.ownedBy?.address as Address,
        amount: totalCostMMC,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to activate subscription.');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 2 }}>Subscribe to Profile</DialogTitle>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <DialogContent>
          {loadingTerms || balanceLoading ? (
            <LinearProgress
              color="inherit"
              sx={{ width: 1, maxWidth: 360, marginTop: '16px', alignSelf: 'center' }}
            />
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
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
                      <Typography align="center" variant="body1" fontWeight="bold">
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
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
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
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Please enter a valid number of days (minimum {minDays} days).
                  </Typography>
                )}
              </Stack>

              {/* Display error if balance is insufficient */}
              {balanceData && !isBalanceSufficient && (
                <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                  Insufficient balance to complete the subscription.
                </Typography>
              )}

              {/* Display any error messages */}
              {errorMessage && (
                <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        {!loadingTerms && (
          <>
            <Divider sx={{ mt: 3, borderStyle: 'dashed' }} />
            <DialogActions>
              <Button variant="text" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                sx={{ backgroundColor: '#fff' }}
                onClick={handleSubscribe}
                disabled={isButtonDisabled}
                loading={loading}
              >
                Subscribe
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Success message Snackbar */}
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

      {/* Error message Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1200 }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
