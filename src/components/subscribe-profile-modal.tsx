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
import LoadingButton from '@mui/lab/LoadingButton';
import { useSubscribe } from '@src/hooks/use-subscribe.ts';
import { Profile } from '@lens-protocol/api-bindings';
import { useResolveTerms } from '@src/hooks/use-resolve-terms.ts';
import LinearProgress from '@mui/material/LinearProgress';

import { ProfileSession, useSession } from '@lens-protocol/react-web';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { setBalance } from '@redux/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBalance } from '@src/hooks/use-get-balance.ts';
import { useSnackbar } from 'notistack';
import {useNotifications} from "@src/hooks/use-notifications.ts";
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';

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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { balance: balanceFromRedux } = useSelector((state: any) => state.auth);

  // State variables for handling durations and messages
  const [selectedDuration, setSelectedDuration] = useState('7');
  const [customDuration, setCustomDuration] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hook to get the user's session data
  const sessionData = useSelector((state: any) => state.auth.session);
  const { balance: balanceFromContract, refetch } = useGetBalance(sessionData?.address);

  // Hooks for subscription and terms resolution
  const { data, error, loading, subscribe } = useSubscribe();
  const { terms, loading: loadingTerms } = useResolveTerms(profile?.ownedBy?.address as Address);

  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  useEffect(() => {
    if (balanceFromContract) {
      dispatch(setBalance({ balance: balanceFromContract }));
    }
  }, [balanceFromContract]);

  // Options for predefined durations
  const durationOptions = [
    { value: '7', title: '1 week' },
    { value: '15', title: '15 days' },
    { value: '30', title: '1 month' },
  ];

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

  const balanceWei = balanceFromRedux
    ? ethers.parseUnits(balanceFromRedux.toString(), 18)
    : BigInt(0);
  const isBalanceSufficient = balanceWei && totalCostWei && balanceWei >= totalCostWei;

  // Determine if the subscribe button should be disabled
  const isButtonDisabled =
    loading ||
    (!selectedDuration && !customDuration) ||
    isCustomDurationInvalid ||
    !isBalanceSufficient;

  // Effect to handle subscription errors
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.shortMessage ?? error.message, { variant: 'error' })
      setErrorMessage(error.shortMessage ?? error.message);
    };
  }, [error]);

  // Effect to handle successful subscription
  useEffect(() => {
    if (data?.receipt) {
      enqueueSnackbar('Successfully joined the profile.', { variant: 'success' })
      onSubscribe?.();
      refetch?.();
      onClose?.();
    }
  }, [data]);

  // Handler for changing the selected duration
  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
    setCustomDuration('');
    setErrorMessage('');
  };

  // Handler for changing the custom duration
  const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDuration('');
    setCustomDuration(event.target.value);
    setErrorMessage('');
  };

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
      setErrorMessage('Insufficient balance to complete the action.');
      return;
    }

    try {
      // Proceed with the subscription using the calculated amount
      await subscribe({
        holderAddress: profile?.ownedBy?.address as Address,
        amount: totalCostMMC,
      }).then(async() => {
        // Send notification to the profile owner
        const notificationPayload = generatePayload('JOIN', {
          id: profile.id,
          displayName: profile?.metadata?.displayName ?? 'no name',
          avatar: (profile?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`,
        }, {
          durationDays,
          totalCostMMC,
          rawDescription: `${sessionData?.profile?.metadata?.displayName} has joined to your content`,
        });
        await sendNotification(profile.id, sessionData?.profile?.id, notificationPayload);
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to join the profile.', { variant: 'error' })
      setErrorMessage('Failed to join the profile.');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 2 }}>Join to {profile?.metadata?.displayName} content</DialogTitle>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <DialogContent>
          {loadingTerms ? (
            <LinearProgress
              color="inherit"
              sx={{ width: 1, maxWidth: 360, marginTop: '16px', alignSelf: 'center' }}
            />
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Select how many days you'd like to join.
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
                    <Typography variant="h6" color={isBalanceSufficient ? 'text.primary' : 'error'}>
                      {totalCostMMC} MMC
                    </Typography>
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
              {/*{balanceFromRedux && !isBalanceSufficient && (*/}
              {/*  <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>*/}
              {/*    Insufficient balance to complete the action.*/}
              {/*  </Typography>*/}
              {/*)}*/}

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
                Join
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
