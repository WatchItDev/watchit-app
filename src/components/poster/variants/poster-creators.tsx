// @mui
import Paper from '@mui/material/Paper';

// components
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import { TrendingTopicsType } from '@src/sections/explore/view.tsx';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

const randomImages = [
  'https://storage.needpix.com/rsynced_images/banner-header-1449745071UBW.jpg',
  'https://storage.needpix.com/rsynced_images/banner-header-tapete-1450368431G3V.jpg',
  'https://i1.pickpik.com/photos/989/475/826/banner-header-points-circle-preview.jpg',
  'https://storage.needpix.com/rsynced_images/banner-header-tapete-1463227719cPu.jpg',
  'https://cdn12.picryl.com/photo/2016/12/31/banner-header-background-backgrounds-textures-b8d9b9-1024.jpg',
  'https://cdn12.picryl.com/photo/2016/12/31/banner-header-christmas-13e7dc-1024.jpg',
];

const PosterCreators = ({ id }: TrendingTopicsType) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(String(id)));
  };

  return (
    <Paper
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
      onClick={handlePosterClick}
    >
      <Box
        sx={{
          width: '99%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: 1,
          padding: 1,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.03)' },
        }}
        onClick={() => {}}
      >
        <Image
          src={randomImages[Math.floor(Math.random() * randomImages.length)]}
          sx={{
            height: 120,
            opacity: 0.7,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        />
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'pointer',
            mt: -3,
            backgroundColor: 'transparent',
            p: (theme) => theme.spacing(0, 2, 1, 2),
          }}
        >
          <Avatar
            src={'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=1'}
            alt={'Alt value'}
            sx={{ width: 48, height: 48, mr: 2 }}
            variant="rounded"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              width: '100%',
            }}
          >
            <ListItemText
              primary={'Name'}
              secondary={<>{'x0000'}</>}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle2',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                noWrap: true,
                display: 'flex',
                component: 'span',
                alignItems: 'center',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          </Box>
        </Card>
      </Box>
    </Paper>
  );
};

export default PosterCreators;
