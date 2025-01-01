// @mui
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

// components
import Iconify from '@src/components/iconify';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import NavigationArrows from '@src/components/carousel/NavigationArrows';

// routes
import { paths } from '@src/routes/paths';
import { useRouter } from '@src/routes/hooks';

// lens
import { Profile } from '@lens-protocol/api-bindings';
import {useDispatch} from "react-redux";
import {storeAddress, toggleRainbow} from '@redux/address';
import React from "react";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: Profile[];
  chunkSize?: number; // how many contacts to display per slide
}

export default function FinanceContactsCarousel({
                                                  title,
                                                  subheader,
                                                  list,
                                                  chunkSize = 5,
                                                  ...other
                                                }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();


  function scrollToSmoothly(pos: number, time: number) {
    let currentPos = window.scrollY;
    let start:number |null = null;
    if(time == null) time = 500;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      let progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  const handleClick = (address: string, profileId: string) => {
    dispatch(toggleRainbow());
    dispatch(storeAddress({address, profileId}));

    // Scroll to top the window with a smooth animation
    scrollToSmoothly(0, 1000)
    setTimeout(() => {
      dispatch(toggleRainbow());
    },1400)
  }

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
  const slidesData: Profile[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    slidesData.push(list.slice(i, i + chunkSize));
  }

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <NavigationArrows next={carousel.onNext} prev={carousel.onPrev} />
        }
      />

      {/* Main carousel container */}
      <Box sx={{ p: 3 }}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slidesData.map((chunk, index) => (
            <SlideContacts
              key={`slide-${index}`}
              chunk={chunk}
              goToProfile={goToProfile}
              onClickArrow={(address, profileId) => handleClick(address, profileId)}
            />
          ))}
        </Carousel>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type SlideContactsProps = {
  chunk: Profile[];
  goToProfile: (id: string) => void;
  onClickArrow: (address: string, profileId: string) => void;
};

function SlideContacts({ chunk, goToProfile, onClickArrow}: SlideContactsProps) {
  const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>, address: string, profileId: string) => {
    event.stopPropagation();
    onClickArrow(address, profileId);
  };
  return (
    <Stack spacing={3}>
      {chunk.map((profile) => (
        <Stack direction="row" alignItems="center" key={profile.id}>
          <Stack
            direction="row"
            alignItems="flex-start"
            sx={{ cursor: 'pointer', flexGrow: 1 }}
            onClick={() => goToProfile(profile.id)}
          >
            <Avatar
              src={
                (profile?.metadata?.picture as any)?.optimized?.uri ??
                `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile?.id}`
              }
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <ListItemText
              primary={profile.metadata?.displayName || 'No Name'}
              secondary={profile.id}
            />
          </Stack>

          <Tooltip title="Quick Transfer">
            <IconButton onClick={(event) => handleArrowClick(event, profile.ownedBy.address, profile.id)}>
              <Iconify icon="eva:diagonal-arrow-right-up-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
}
