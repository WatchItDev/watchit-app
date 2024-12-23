import React, { useState, useEffect, useCallback } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
// components
import Carousel, { CarouselArrows, useCarousel } from '@src/components/carousel';
import {useSelector} from "react-redux";
import {truncateAddress} from "@src/utils/wallet.ts";
import {Profile} from "@lens-protocol/api-bindings";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import LoadingButton from "@mui/lab/LoadingButton";
import { supabase } from '@src/utils/supabase';
import {useNotificationPayload} from "@src/hooks/use-notification-payload.ts";
import {useNotifications} from "@src/hooks/use-notifications.ts";
import {useSnackbar} from "notistack";
import { InputAmount, InputAmountProps } from '@src/components/input-amount.tsx';
import { ethers } from 'ethers';

// ----------------------------------------------------------------------

const STEP = 50;

const MIN_AMOUNT = 0;

const AVATAR_SIZE = 40;

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: Profile[] | undefined;
}

// ----------------------------------------------------------------------

const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// ----------------------------------------------------------------------

export default function BankingQuickTransfer({ title, subheader,sx, list, ...other }: Props) {
  const theme = useTheme();
  const balance = useSelector((state: any) => state.auth.balance);
  const [walletAddress, setWalletAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const MAX_AMOUNT = balance;
  const carousel = useCarousel({
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: '0px',
    rows: 1,
    // @ts-ignore
    slidesToShow: list?.length > 7 ? 7 : list?.length ?? 1,
    responsive: [
      {
        // Down 1600
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        // Down 1400
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        // Down 900
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        // Down 400
        breakpoint: 400,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });
  const [amount, setAmount] = useState(0);
  const confirm = useBoolean();
  const [initialized, setInitialized] = useState(false);
  const getContactInfo: Profile | undefined= list?.find((_, index) => index === carousel.currentIndex);

  useEffect(() => {
    if (!initialized && list?.length && carousel.carouselRef.current) {
      carousel.setCurrentIndex(list?.length > 5 ? 2 : 0);
      setInitialized(true);
    }
  }, [list, carousel, initialized]);

  useEffect(() => {
    const currentProfile = list?.[carousel.currentIndex];
    if (currentProfile?.ownedBy?.address) {
      setWalletAddress(currentProfile.ownedBy.address);
    }
  }, [carousel.currentIndex, list]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWalletAddress(value);

    if (isValidAddress(value)) {
      setAddressError(false);
    } else {
      setAddressError(true);
    }
  };

  const handleChangeSlider = useCallback((_event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
  }, []);

  const handleChangeInput = useCallback((_event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(_event.target.value));
  }, []);

  const handleBlur = useCallback(() => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT);
    }
  }, [amount]);

  const handleTransferFinish = () => {
    setAmount(0)
    setWalletAddress('')
    confirm.onFalse?.();
  }

  const renderWalletInput = (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Wallet Address"
        value={walletAddress}
        onChange={handleInputChange}
        placeholder="Enter wallet address"
        error={addressError}
        helperText={addressError ? 'Invalid wallet address' : ''}
      />
    </Box>
  );

  const renderCarousel = (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <CarouselArrows
        filled
        onPrev={carousel.onPrev}
        onNext={carousel.onNext}
        leftButtonProps={{
          sx: {
            p: 0.5,
            mt: -1.5,
            left: -8,
            '& svg': { width: 16, height: 16 },
          },
        }}
        rightButtonProps={{
          sx: {
            p: 0.5,
            mt: -1.5,
            right: -8,
            '& svg': { width: 16, height: 16 },
          },
        }}
      >
        <Box
          component={Carousel}
          ref={carousel.carouselRef}
          {...carousel.carouselSettings}
          sx={{
            width: 1,
            mx: 'auto',
            maxWidth: AVATAR_SIZE * 7 + 160,
          }}
        >
          {list?.map((profile, index) => (
            <Box key={profile.id} sx={{ py: 2 }}>
              <Tooltip key={profile.id} title={profile?.metadata?.displayName} arrow placement="top">
                <Avatar
                  src={
                    (profile?.metadata?.picture as any)?.optimized?.uri ??
                    `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
                  }
                  alt={profile?.handle?.localName ?? ''}
                  sx={{
                    mx: 'auto',
                    opacity: 0.80,
                    cursor: 'pointer',
                    transition: theme.transitions.create('all'),
                    ...(index === carousel.currentIndex && {
                      opacity: 1,
                      transform: 'scale(1.25)',
                      boxShadow: '-4px 12px 24px 0 rgb(0,0,0,0.24)',
                    }),
                  }}
                  variant="rounded"
                />
              </Tooltip>
            </Box>
          ))}
        </Box>
      </CarouselArrows>
    </Box>
  );

  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(balance);

  const renderInput = (
    <Stack spacing={3}>

      <InputAmount
        max={MAX_AMOUNT}
        amount={amount}
        onBlur={handleBlur}
        onChange={handleChangeInput}
      />

      <Slider
        color={'secondary'}
        value={typeof amount === 'number' ? amount : 0}
        valueLabelDisplay="auto"
        step={STEP}
        marks
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        onChange={handleChangeSlider}
      />

      <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle1' }}>
        <Box component="span" sx={{ flexGrow: 1 }}>
          Your Balance
        </Box>
        {formattedBalance} MMC
      </Stack>

      <Button
        size="large"
        color="inherit"
        variant="contained"
        disabled={amount === 0 || !isValidAddress(walletAddress)}
        onClick={confirm.onTrue}
      >
        Transfer Now
      </Button>
    </Stack>
  );

  return (
    <>
      <Stack
        sx={{
          borderRadius: 2,
          bgcolor: 'background.neutral',
          ...sx,
        }}
        {...other}
      >
        <CardHeader title={title} subheader={subheader} />

        <Stack sx={{ p: 3 }}>
          {renderWalletInput}

          {!!list?.length ? renderCarousel : undefined}

          {renderInput}
        </Stack>
      </Stack>

      <ConfirmTransferDialog
        max={MAX_AMOUNT}
        amount={amount}
        onBlur={handleBlur}
        open={confirm.value}
        address={walletAddress}
        onClose={handleTransferFinish}
        contactInfo={getContactInfo}
        onChange={handleChangeInput}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  contactInfo?: Profile;
  address?: string;
  onClose: VoidFunction;
}

function ConfirmTransferDialog({
  open,
  amount,
  contactInfo,
  onClose,
  address
}: ConfirmTransferDialogProps) {
  const sessionData = useSelector((state: any) => state.auth.session);
  const { generatePayload } = useNotificationPayload(sessionData);
  const { sendNotification } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const isSame = contactInfo?.ownedBy?.address === address;
  const defaultImage = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${address}`;
  const defaultName = 'Destination wallet';

  async function storeTransactionInSupabase(receiver_id?: string, sender_id?: string, payload?: any) {
    setLoading(true);

    const { error } = await supabase
      .from('transactions')
      .insert([{ receiver_id, sender_id, payload }]);

    if (error) {
      console.error('Error storing transaction:', error);
    } else {
      console.log('Transaction stored successfully');
    }
  }

  const handleConfirmTransfer = async () => {
    setLoading(true);
    const senderId = sessionData?.profile?.id;

    const notificationPayload = generatePayload('TRANSFER', {
      id: contactInfo?.id ?? '',
      displayName: contactInfo?.metadata?.displayName ?? 'no name',
      avatar: (contactInfo?.metadata?.picture as any)?.optimized?.uri,
    }, {
      rawDescription: `${sessionData?.profile?.metadata?.displayName} sent you ${amount} MMC`,
      message,
    });

    await storeTransactionInSupabase(contactInfo?.id, senderId, {
      address: contactInfo?.ownedBy?.address,
      amount,
      message,
      notificationPayload
    });

    await sendNotification(contactInfo?.id ?? '', sessionData?.profile?.id, notificationPayload);

    enqueueSnackbar('The transfer has been sent to ' + contactInfo?.metadata?.displayName , { variant: 'success' })

    setLoading(false);
    onClose();
  };

  const RainbowEffect = loading ? NeonPaper : Box;
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>Transfer to</DialogTitle>
      <Stack direction="column" spacing={3} sx={{ px: 3 }}>
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <Avatar
             src={isSame ? (contactInfo?.metadata?.picture as any)?.optimized?.uri ?? defaultImage : defaultImage}
             sx={{ width: 48, height: 48 }} />

            <ListItemText
              primary={isSame ? contactInfo?.metadata?.displayName ?? defaultName : defaultName}
              secondary={truncateAddress(address ?? '')}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Stack>

          <Stack direction={'column'} spacing={0} sx={{ py: 2, flexGrow: 1 }}>
            <ListItemText
              primary={'Amount:'}
              secondary={`${amount} MMC`}
              secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />
          </Stack>
        </Stack>
        <TextField
          onChange={(e) => setMessage(e.target.value)}
          fullWidth multiline rows={3} placeholder="Write a message..." />
      </Stack>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <RainbowEffect borderRadius={'10px'} animationSpeed={'3s'} padding={'0'} width={'auto'} >
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#fff' }}
            onClick={handleConfirmTransfer}
            disabled={loading}
            loading={loading}
          >
            Confirm & Transfer
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </Dialog>
  );
}
