// React and libraries imports
import React from 'react';
import { useDispatch } from 'react-redux';

// @mui
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

// Project components
import Iconify from '@src/components/iconify';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import CarouselNavigationArrows from '@src/components/carousel/components/carousel-navigation-arrows.tsx';
import AvatarProfile from '@src/components/avatar/avatar.tsx';

// routes
import { paths } from '@src/routes/paths';
import { useRouter } from '@src/routes/hooks';

import { FinanceContactsCarouselProps } from '@src/sections/finance/types.ts';
import { storeAddress, toggleRainbow } from '@redux/address';
import { User } from '@src/graphql/generated/graphql.ts';
import { resolveSrc } from '@src/utils/image.ts';
import { truncateAddress } from '@src/utils/wallet.ts';

// ----------------------------------------------------------------------

export default function FinanceContactsCarousel(
  props: Readonly<FinanceContactsCarouselProps>,
) {
  const { title, subheader, list, chunkSize = 5, ...other } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  function scrollToSmoothly(pos: number, time: number) {
    const currentPos = window.scrollY;
    let start: number | null = null;
    if (time == null) time = 500;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ((pos = +pos), (time = +time));

    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;

      const lgPos = ((pos - currentPos) * progress) / time + currentPos;
      const gtPos = currentPos - ((currentPos - pos) * progress) / time;
      window.scrollTo(0, currentPos < pos ? lgPos : gtPos);

      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  const handleClick = (address: string, profileId: string) => {
    dispatch(toggleRainbow());
    dispatch(storeAddress({ address, profileId }));

    // Scroll to top the window with a smooth animation
    scrollToSmoothly(0, 1000);
    setTimeout(() => {
      dispatch(toggleRainbow());
    }, 1400);
  };

  const goToProfile = (id: string) => {
    router.push(paths.dashboard.user.root(id));
  };

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    dots: false,
    arrows: false,
    adaptiveHeight: true,
  });

  // Split the array of contacts into chunks (each chunk is a "slide")
  const slidesData: User[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    slidesData.push(list.slice(i, i + chunkSize));
  }

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <CarouselNavigationArrows
            next={carousel.onNext}
            prev={carousel.onPrev}
          />
        }
        sx={{ px: 0 }}
      />

      {/* Main carousel container */}
      <Box sx={{ py: 3 }}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slidesData.map((chunk, index) => (
            <SlideContacts
              key={`slide-${index}`}
              chunk={chunk}
              goToProfile={goToProfile}
              onClickArrow={(address, profileId) =>
                handleClick(address, profileId)
              }
            />
          ))}
        </Carousel>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface SlideContactsProps {
  chunk: User[];
  goToProfile: (id: string) => void;
  onClickArrow: (address: string, profileId: string) => void;
}

function SlideContacts({
  chunk,
  goToProfile,
  onClickArrow,
}: SlideContactsProps) {
  const handleArrowClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    address: string,
    profileId: string,
  ) => {
    event.stopPropagation();
    onClickArrow(address, profileId);
  };
  return (
    <Stack spacing={3}>
      {chunk.map((profile) => (
        <Stack direction="row" alignItems="center" key={profile.address}>
          <Stack
            direction="row"
            alignItems="flex-start"
            sx={{ cursor: 'pointer', flexGrow: 1 }}
            onClick={() => goToProfile(profile.address)}
          >
            <AvatarProfile
              alt={profile.displayName || 'No Name'}
              src={resolveSrc(
                profile.profilePicture || profile.address,
                'profile',
              )}
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <ListItemText
              primary={profile.displayName || 'No Name'}
              secondary={truncateAddress(profile.address)}
            />
          </Stack>

          <Tooltip title="Quick Transfer">
            <IconButton
              onClick={(event) =>
                handleArrowClick(event, profile.address, profile.address)
              }
            >
              <Iconify icon="eva:diagonal-arrow-right-up-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
}
