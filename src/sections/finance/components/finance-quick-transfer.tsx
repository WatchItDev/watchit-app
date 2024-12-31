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
import { CardProps } from '@mui/material/Card';

// hooks
import { useBoolean } from '@src/hooks/use-boolean';
// components
import Carousel, { CarouselArrows, useCarousel } from '@src/components/carousel';
import {useDispatch, useSelector} from "react-redux";
import {storeAddress, toggleRainbow} from '@redux/address';
import {Profile} from "@lens-protocol/api-bindings";
import NeonPaper from "@src/sections/publication/NeonPaperContainer.tsx";
import { InputAmount } from '@src/components/input-amount.tsx';
import { ethers } from 'ethers';
import FinanceQuickTransferModal from "@src/sections/finance/components/finance-quick-transfer-modal.tsx";

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

export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// ----------------------------------------------------------------------

export default function FinanceQuickTransfer({ title, subheader,sx, list, ...other }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const storedAddress = useSelector((state: any) => state.address)
  const showRainbow = useSelector((state: any) => state.address.showRainbow)
  const balance = useSelector((state: any) => state.auth.balance);
  const [walletAddress, setWalletAddress] = useState(storedAddress.address ?? '');
  const [addressError, setAddressError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addressFiltered, setAddressFiltered] = useState<boolean>(false);
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
      dispatch(storeAddress({ address: currentProfile.ownedBy.address, profileId: currentProfile.id }))
    }
  }, [carousel.currentIndex, list]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWalletAddress(value);
    dispatch(storeAddress({ address: value, profileId: getContactInfo?.id ?? ''}))

    if (isValidAddress(value)) {
      setAddressFiltered(true);
      dispatch(toggleRainbow());
      setAddressError(false);
    } else {
      setAddressError(true);
    }

    setTimeout(() => {
      dispatch(toggleRainbow());
    },1400)
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
    dispatch(storeAddress({ address: '', profileId: ''}))
  }

  useEffect(() => {
    const index = list?.findIndex((profile) => profile.ownedBy?.address === storedAddress?.address && profile.id === storedAddress.profileId);

      if (index !== -1) {
        setCurrentIndex(index ?? 0)
      }

      // Verify is only the address is stored(changed)
      if (addressFiltered) {
        //find in list only filtering the address
        const profile = list?.findIndex((profile) => profile.ownedBy?.address === storedAddress?.address);

        // If the address is found, set the current index
        if (profile !== -1) {
          setCurrentIndex(profile ?? 0)
        }

        // Reset the filter
        setAddressFiltered(false);
      }

  }, [storedAddress]);


  useEffect(() => {
    if (!showRainbow) {
      if (carousel.carouselRef.current) {
        carousel.carouselRef.current.slickGoTo(currentIndex);
      }
    }
  }, [showRainbow]);

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
                      filter: 'blur(10)',
                      transform: 'scale(1.50)',
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

  const Wrapper = showRainbow ? NeonPaper : Box;

  return (
    <>
      <Wrapper animationSpeed={'1s'} padding={'0'}>
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
      </Wrapper>

      <FinanceQuickTransferModal
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