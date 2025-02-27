// REACT IMPORTS
import React, { useEffect, useState } from 'react';

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
} from '@mui/material';

// ETHERS IMPORTS
import { ethers } from 'ethers';

// VIEM IMPORTS
import { encodeAbiParameters } from 'viem';

// LOCAL IMPORTS
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useAuthorizePolicy } from '@src/hooks/protocol/use-authorize-policy.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';

// ----------------------------------------------------------------------

interface ActivateSubscriptionProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ActivateSubscriptionProfileModal = ({
  isOpen,
  onClose,
}: ActivateSubscriptionProfileModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');

  const { authorize, loading, error } = useAuthorizePolicy();

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
    const amount = customAmount || selectedAmount;
    if (!amount) {
      return;
    }

    try {
      // Convert the amount to Wei (BigInt)
      const amountInWeiBigNumber = ethers.parseUnits(amount, 18);
      const amountInWei = BigInt(amountInWeiBigNumber);

      // Encode parameters: amount in Wei and MMC address
      const types = [
        { name: 'amount', type: 'uint256' },
        { name: 'token', type: 'address' },
      ];
      const values = [amountInWei, GLOBAL_CONSTANTS.MMC_ADDRESS];
      // @ts-ignore
      const encodedData = encodeAbiParameters(types, values);

      await authorize({
        policyAddress: GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
        data: encodedData,
      });

      notifySuccess(SUCCESS.JOINING_PRICE_SUCCESSFULLY);

      onClose?.();
    } catch (err) {
      notifyError(ERRORS.ACTIVATE_SUBSCRIPTION_FAILED_ERROR);
    }
  };

  // Calculate estimated costs
  const amountNumber = parseFloat(customAmount || selectedAmount || '0');

  const weeklyCost = (amountNumber * 7).toFixed(2);
  const fifteenDaysCost = (amountNumber * 15).toFixed(2);
  const monthlyCost = (amountNumber * 30).toFixed(2);

  const RainbowEffect = loading ? NeonPaper : Box;
  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 2 }}>Set join price</DialogTitle>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Users will pay a <span style={{ fontWeight: 'bolder' }}>daily</span> rate to access your
            content.
          </Typography>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              {amountOptions.map((option) => (
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
                    opacity: selectedAmount === option.value ? 1 : 0.4,
                    border:
                      selectedAmount === option.value
                        ? '2px solid rgba(255,255,255,0.3)'
                        : '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {option.title}
                  </Typography>
                  <Typography variant="caption" textAlign={'center'}>
                    MMC
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <TextField
              type="number"
              placeholder="Enter a custom amount in MMC"
              fullWidth
              value={customAmount}
              onChange={handleCustomAmountChange}
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
          </Stack>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <Stack spacing={1}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Users will pay:
            </Typography>
            <Stack spacing={1} direction="row">
              <Stack
                spacing={0}
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  flexGrow: 1,
                }}
              >
                <Typography variant="body1" textAlign="center">
                  {weeklyCost} MMC
                </Typography>
                <Typography variant="body2" textAlign="center" color="textSecondary">
                  per week
                </Typography>
              </Stack>
              <Stack
                spacing={0}
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  flexGrow: 1,
                }}
              >
                <Typography variant="body1" textAlign="center">
                  {fifteenDaysCost} MMC
                </Typography>
                <Typography variant="body2" textAlign="center" color="textSecondary">
                  each 15 days
                </Typography>
              </Stack>
              <Stack
                spacing={0}
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  flexGrow: 1,
                }}
              >
                <Typography variant="body1" textAlign="center">
                  {monthlyCost} MMC
                </Typography>
                <Typography variant="body2" textAlign="center" color="textSecondary">
                  per month
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <Divider sx={{ mt: 3, borderStyle: 'dashed' }} />
        <DialogActions>
          <Button variant="text" onClick={onClose}>
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
              onClick={handleAuthorizeSubscription}
              disabled={loading || (!selectedAmount && !customAmount)}
              loading={loading}
            >
              Confirm
            </LoadingButton>
          </RainbowEffect>
        </DialogActions>
      </Dialog>
    </>
  );
};
