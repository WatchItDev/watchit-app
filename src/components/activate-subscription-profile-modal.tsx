// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// MUI IMPORTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Skeleton,
} from '@mui/material';

// VIEM IMPORTS
import { encodeAbiParameters, parseUnits, formatUnits, Address } from 'viem';

// LOCAL IMPORTS
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useAuthorizePolicy } from '@src/hooks/protocol/use-authorize-policy.ts';
import { useGetPolicyTerms } from '@src/hooks/protocol/use-get-policy-terms.ts'; // <-- uses refetch
import { useAuth } from '@src/hooks/use-auth.ts';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { ActivateSubscriptionProfileModalProps } from '@src/components/types.ts';

export const ActivateSubscriptionProfileModal = ({
                                                   isOpen,
                                                   onClose,
                                                 }: ActivateSubscriptionProfileModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');

  const { authorize, loading, error } = useAuthorizePolicy();

  const { session } = useAuth();
  const creatorAddress = (session?.user?.address ?? '0x0000000000000000000000000000000000000000') as Address;

  const { terms, loading: loadingTerms, refetch: refetchTerms } = useGetPolicyTerms(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS as Address,
    creatorAddress
  );

  const currentPriceWei = terms?.amount ?? 0n;
  const hasCurrent = currentPriceWei > 0n;
  const trimAmount = (v: string) => v.replace(/\.?0+$/, '');
  const currentPriceMMC = hasCurrent ? trimAmount(formatUnits(currentPriceWei, 18)) : null;
  const initializedRef = useRef(false);
  const proposedAmount = customAmount || selectedAmount || '';
  const isUnchanged = hasCurrent && proposedAmount === currentPriceMMC;
  const amountNumber = parseFloat(proposedAmount || '0');
  const weeklyCost = (amountNumber * 7).toFixed(2);
  const fifteenDaysCost = (amountNumber * 15).toFixed(2);
  const monthlyCost = (amountNumber * 30).toFixed(2);
  const RainbowEffect = loading ? NeonPaper : Box;

  useEffect(() => {
    if (isOpen) {
      initializedRef.current = false;
      setSelectedAmount('10');
      setCustomAmount('');
      refetchTerms?.();
    }
  }, [isOpen, refetchTerms]);

  useEffect(() => {
    if (!isOpen || loadingTerms || initializedRef.current) return;
    if (hasCurrent && currentPriceMMC) {
      setSelectedAmount(currentPriceMMC);
      setCustomAmount('');
    }
    initializedRef.current = true;
  }, [isOpen, loadingTerms, hasCurrent, currentPriceMMC]);

  const amountOptions = [
    { value: '1', title: '1' },
    { value: '5', title: '5' },
    { value: '10', title: '10' },
  ];

  useEffect(() => {
    if (error) notifyError(error as ERRORS);
  }, [error]);

  const handleAmountChange = (value: string) => {
    setSelectedAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAmount('');
    setCustomAmount(event.target.value);
  };

  const handleAuthorizeSubscription = async () => {
    const amount = proposedAmount;
    if (!amount) return;
    if (isUnchanged) {
      notifySuccess(SUCCESS.JOINING_PRICE_SUCCESSFULLY);
      onClose?.();
      return;
    }

    try {
      const amountInWeiBigNumber = parseUnits(amount, 18);
      const amountInWei = BigInt(amountInWeiBigNumber);

      const types = [
        { name: 'amount', type: 'uint256' },
        { name: 'token', type: 'address' },
      ];
      const values = [amountInWei, GLOBAL_CONSTANTS.MMC_ADDRESS];
      const encodedData = encodeAbiParameters(types, values);

      await authorize({
        policyAddress: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        data: encodedData,
      });

      notifySuccess(SUCCESS.JOINING_PRICE_SUCCESSFULLY);
      onClose?.();
    } catch (err) {
      console.error('Error authorizing subscription:', err);
      notifyError(ERRORS.ACTIVATE_SUBSCRIPTION_FAILED_ERROR);
    }
  };


  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 2 }}>Set join price</DialogTitle>
      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

      <DialogContent>
        {loadingTerms ? (
          <Skeleton variant="rounded" height={44} sx={{ mb: 2, borderRadius: 1 }} />
        ) : hasCurrent ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Your <b>current price</b> is <b>{currentPriceMMC} MMC/day</b>. You can change it below.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You don't have a <b>daily price</b> set yet. Define one below to enable subscriptions.
          </Alert>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Users will pay a <span style={{ fontWeight: 'bolder' }}>daily</span> rate to access your content.
        </Typography>

        <Stack spacing={2}>
          <Stack spacing={2} direction="row">
            {amountOptions.map((option) => {
              const isSelected = selectedAmount === option.value && !customAmount;
              return (
                <Paper
                  key={option.value}
                  onClick={() => handleAmountChange(option.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                    cursor: 'pointer',
                    width: '33%',
                    backgroundColor: 'transparent',
                    opacity: isSelected ? 1 : 0.4,
                    border: isSelected
                      ? '2px solid rgba(255,255,255,0.3)'
                      : '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { opacity: 1 },
                    position: 'relative',
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {option.title}
                  </Typography>
                  <Typography variant="caption" textAlign="center">
                    MMC
                  </Typography>
                </Paper>
              );
            })}
          </Stack>

          <TextField
            type="number"
            placeholder="Enter a custom amount in MMC"
            fullWidth
            value={customAmount}
            onChange={handleCustomAmountChange}
            InputProps={{ inputProps: { min: 1 } }}
            helperText={
              hasCurrent
                ? 'This change will apply to new subscriptions.'
                : 'Set your daily price in MMC.'
            }
          />
        </Stack>

        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

        <Stack spacing={1}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Users will pay:
          </Typography>
          <Stack spacing={1} direction="row">
            <Stack sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, flexGrow: 1 }}>
              <Typography variant="body1" textAlign="center">{weeklyCost} MMC</Typography>
              <Typography variant="body2" textAlign="center" color="textSecondary">per week</Typography>
            </Stack>
            <Stack sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, flexGrow: 1 }}>
              <Typography variant="body1" textAlign="center">{fifteenDaysCost} MMC</Typography>
              <Typography variant="body2" textAlign="center" color="textSecondary">every 15 days</Typography>
            </Stack>
            <Stack sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, flexGrow: 1 }}>
              <Typography variant="body1" textAlign="center">{monthlyCost} MMC</Typography>
              <Typography variant="body2" textAlign="center" color="textSecondary">per month</Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <Divider sx={{ mt: 3, borderStyle: 'dashed' }} />
      <DialogActions>
        <Button variant="text" onClick={onClose}>Cancel</Button>

        <RainbowEffect {...(loading && { borderRadius: '10px', animationSpeed: '3s', padding: '0', width: 'auto' })}>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleAuthorizeSubscription}
            disabled={loading || !proposedAmount || isUnchanged || loadingTerms}
            loading={loading}
          >
            {isUnchanged ? 'No changes' : 'Confirm'}
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
};
