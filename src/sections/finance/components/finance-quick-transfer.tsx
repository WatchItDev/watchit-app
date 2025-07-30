// REACT IMPORTS
import React, { useCallback, useEffect, useState } from 'react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { storeAddress } from '@redux/address';

import { isAddress } from 'viem';

// MUI
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import { CardProps } from '@mui/material/Card';

// LOCAL IMPORTS
import { useBoolean } from '@src/hooks/use-boolean';
import Carousel, { CarouselArrows, useCarousel } from '@src/components/carousel';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { InputAmount } from '@src/components/input-amount.tsx';
import FinanceQuickTransferModal from '@src/sections/finance/components/finance-quick-transfer-modal.tsx';
import FinanceSearchProfileModal from '@src/sections/finance/components/finance-search-profile-modal.tsx';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import FinanceNoFollowingsQuickTransfer
  from "@src/sections/finance/components/finance-no-followings-quick-transfer";
import FinanceDisplayProfileInfo from "@src/sections/finance/components/finance-display-profile-info";
import {handleAmountConstraints} from "@src/utils/format-number.ts";
import {LoadingScreen} from "@src/components/loading-screen";
import { useAuth } from '@src/hooks/use-auth.ts';
import {RootState} from "@redux/store.ts"
import { User } from '@src/graphql/generated/graphql.ts';
import { resolveSrc } from '@src/utils/image.ts';

// ----------------------------------------------------------------------

const STEP = 50;
const MIN_AMOUNT = 0;
// A thousand millions allowed in the pool
export const MAX_POOL = 1000000000;

export interface FinanceQuickTransferProps extends CardProps {
  title?: string;
  subheader?: string;
  list: User[] | null | undefined;
  loading: boolean;
}

// ----------------------------------------------------------------------

export default function FinanceQuickTransfer({
  title,
  subheader,
  sx,
  list: initialList,
  loading,
  ...other
}: FinanceQuickTransferProps) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const storedAddress = useSelector((state: RootState) => state.address);
  const showRainbow = useSelector((state: RootState) => state.address.showRainbow);

  const { balance } = useAuth();

  const [walletAddress, setWalletAddress] = useState(storedAddress.address ?? '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addressFiltered, setAddressFiltered] = useState<boolean>(false);
  const [initialized, setInitialized] = useState(false);
  const [list, setList] = useState<User[]>(initialList ?? []);
  const [amount, setAmount] = useState(0);
  const [canContinue, setCanContinue] = useState(true);

  const confirm = useBoolean();
  const MAX_AMOUNT = balance;

  // This gets the current profile in the carousel
  const getContactInfo: User | undefined = list?.find((_, index) => index === currentIndex);

  // Callback to handle a profile selection from the search modal
  const handleSelectProfile = (profile: User) => {
    setList((prev) => {
      // 1) Add the profile if it's not already there
      const exists = prev.find((p) => p.address === profile.address);
      const newList = exists ? prev : [...prev, profile];

      // 2) Find the index of that profile in the new list
      const updatedIndex = newList.findIndex((p) => p.address === profile.address);
      const finalIndex = updatedIndex !== -1 ? updatedIndex : newList.length - 1;

      // 3) Move the carousel right now
      carousel.setCurrentIndex(finalIndex);
      setCurrentIndex(finalIndex);

      // 4) Update the wallet address & Redux
      setWalletAddress(profile.address ?? '');
      dispatch(storeAddress({ address: profile.address, profileId: profile.address }));

      // Return the updated array
      return newList;
    });
  };

  // Carousel config
  const carousel = useCarousel({
    centerMode: true,
    swipeToSlide: true,
    infinite: true,
    centerPadding: '0px',
    rows: 1,
    slidesToShow: list?.length > 7 ? 7 : (list?.length ?? 1),
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });

  // Initialize the carousel index
  useEffect(() => {
    if (!initialized && list?.length && carousel.carouselRef.current) {
      carousel.setCurrentIndex(list?.length > 5 ? 2 : 0);
      setInitialized(true);
    }
  }, [list, carousel, initialized]);

  // Whenever the carousel index changes, update the wallet address in state
  useEffect(() => {
    const currentProfile: User = list?.[carousel.currentIndex];
    if (currentProfile?.address) {
      const profileId = currentProfile.address
      const address = currentProfile.address;

      setWalletAddress(address);
      dispatch(storeAddress({ address, profileId }));
    }
  }, [carousel.currentIndex, list]);

  // Merge initialList into local list when it changes
  useEffect(() => {
    if (initialList && initialList.length > 0) {
      setList((prev) => {
        // Combine the current local list + the new initialList
        const combined = [...prev, ...initialList];

        // Filter duplicates (by id)
        return combined.filter(
          (profile, index, arr) => arr.findIndex((p) => p.address === profile.address) === index
        );
      });
    }
  }, [initialList]);

  // Handle changes in the slider
  const handleChangeSlider = useCallback((_event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
    if(newValue < MAX_AMOUNT) {
      setCanContinue(true);
    }
  }, [MAX_AMOUNT]);

  const handleChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    handleAmountConstraints({value, MAX_AMOUNT, MAX_POOL, setAmount, setCanContinue});
  }, [MAX_AMOUNT]);


  const handleBlur = useCallback(() => {
    handleAmountConstraints({value: amount, MAX_AMOUNT, MAX_POOL, setAmount, setCanContinue});
  }, [amount, MAX_AMOUNT]);


  // Called after finishing a transfer
  const handleTransferFinish = () => {
    setAmount(0);
    setWalletAddress('');
    confirm.onFalse?.();
    dispatch(storeAddress({ address: '', profileId: '' }));
  };

  // Handle onClick for carousel items
  const handleCarouselClick = (index: number) => {
    // When user clicks on a profile, set the currentIndex to that index in the carousel
    setCurrentIndex(index);
  };

  // If the stored address changes or if we typed a valid custom address, check if it exists in the carousel
  useEffect(() => {
    // Attempt to match the stored address + profileId
    const index = list?.findIndex(
      (profile) =>
        profile.address === storedAddress.address &&
        profile.address === storedAddress.profileId
    );

    if (index !== -1 && index !== undefined) {
      setCurrentIndex(index);
    }

    // If the user typed in an address, check if it's in the list by address only
    if (addressFiltered) {
      const profileIndex = list?.findIndex(
        (profile) =>
          profile.address === storedAddress.address
      );

      if (profileIndex !== -1 && profileIndex !== undefined) {
        setCurrentIndex(profileIndex);
      } else {
        // If it doesn't exist, deselect the carousel by using -1
        setCurrentIndex(-1);
      }
      setAddressFiltered(false);
    }
  }, [storedAddress, addressFiltered, list]);

  // If rainbow effect is off, forcibly move the carousel to currentIndex
  useEffect(() => {
    if (!showRainbow && carousel.carouselRef.current && currentIndex !== -1) {
      carousel.carouselRef.current.slickGoTo(currentIndex);
    }
  }, [showRainbow, currentIndex, carousel]);

  // Render the carousel of profiles
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
            // maxWidth: AVATAR_SIZE * 7 + 160,
          }}
        >
          {list?.map((profile, index) => (
            <Box key={profile.address} sx={{ py: 2 }} onClick={ () => handleCarouselClick(index)}>
              <Tooltip
                key={profile.address}
                title={profile.displayName}
                arrow
                placement="top"
              >
                <AvatarProfile
                  src={resolveSrc(profile.profilePicture || profile.address, 'profile')}
                  alt={profile.username ?? ''}
                  sx={{
                    mx: 'auto',
                    opacity: 0.8,
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

  // Format balance to 3 decimals
  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 };
  const formattedBalance = new Intl.NumberFormat('en-US', balanceOptions).format(balance);

  // Render the input for the amount and the slider
  const renderInput = (
    <Stack spacing={3}>
      <InputAmount
        max={MAX_POOL}
        amount={amount}
        onBlur={handleBlur}
        onChange={handleChangeInput}
      />

      <Slider
        color={canContinue ? 'secondary' : 'warning'}
        value={amount ?? 0}
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
        disabled={amount === 0 || !isAddress(walletAddress) || !canContinue}
        onClick={confirm.onTrue}
      >
        Send
      </Button>
    </Stack>
  );

  const Wrapper = showRainbow ? NeonPaper : Box;

  return (
    <>
      <Wrapper
        {...(showRainbow && {
          animationSpeed: '1s',
          padding: '0',
        })}
      >
        <Stack
          sx={{
            borderRadius: 2,
            bgcolor: 'background.neutral',
            ...sx,
          }}
          {...other}
        >
          <CardHeader
            sx={{ p: '12px 16px 0 0' }}
            title={title}
            subheader={subheader}
            action={<FinanceSearchProfileModal onSelectProfile={handleSelectProfile} />}
          />

          {/* Content */}
          { loading ? <LoadingScreen sx={{marginBottom: 5}} /> : (<Stack sx={{ p: 3 }}>
            <FinanceDisplayProfileInfo mode={'profile'} initialList={list} carousel={carousel} />
            {list?.length > 0 ? renderCarousel : <FinanceNoFollowingsQuickTransfer />}
            <FinanceDisplayProfileInfo mode={'wallet'} initialList={list} carousel={carousel} />
            {renderInput}
          </Stack>) }
        </Stack>
      </Wrapper>

      {/* Final confirm & transfer modal */}
      <FinanceQuickTransferModal
        max={MAX_AMOUNT}
        amount={amount}
        onBlur={handleBlur}
        open={confirm.value}
        address={walletAddress}
        onClose={confirm.onFalse}
        onFinish={handleTransferFinish}
        contactInfo={getContactInfo}
        onChange={handleChangeInput}
      />
    </>
  );
}

