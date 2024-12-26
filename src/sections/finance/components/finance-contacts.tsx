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
};

function SlideContacts({ chunk, goToProfile }: SlideContactsProps) {
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
            <IconButton>
              <Iconify icon="eva:diagonal-arrow-right-up-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
}
