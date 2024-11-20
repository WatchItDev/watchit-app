// @mui
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

// components
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import {TrendingTopicsType} from "@src/sections/explore/view.tsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const randomImages = [
  'https://storage.needpix.com/rsynced_images/banner-header-1449745071UBW.jpg',
  'https://storage.needpix.com/rsynced_images/banner-header-tapete-1450368431G3V.jpg',
  'https://i1.pickpik.com/photos/989/475/826/banner-header-points-circle-preview.jpg',
  'https://storage.needpix.com/rsynced_images/banner-header-tapete-1463227719cPu.jpg',
  'https://cdn12.picryl.com/photo/2016/12/31/banner-header-background-backgrounds-textures-b8d9b9-1024.jpg',
  'https://cdn12.picryl.com/photo/2016/12/31/banner-header-christmas-13e7dc-1024.jpg',
]

const randomColorsForBackground = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
  '#000000',
  ];


const PosterLatestContent = ({ id }: TrendingTopicsType) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(String(id)));
  }

  return (
    <Paper
      sx={{
        width: '100%',
        height: 600,
        marginBottom: 4,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: randomColorsForBackground[Math.floor(Math.random() * randomColorsForBackground.length)],
        cursor: 'pointer',
        '&:hover': {
          // Make a small move to the top
          transform: 'translateY(-4px)',
        },
      }}
      onClick={handlePosterClick}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: 1,
          padding: 1,
          transition: 'transform 0.2s ease-in-out',

        }}
        onClick={() => {}}
      >
        <Image
          src={randomImages[Math.floor(Math.random() * randomImages.length)]}
          sx={{
            height: '50%',
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        />

        <Box
               sx={{ mt: 2, flexDirection: 'column', display: 'flex', justifyContent: 'space-between', height: '50%' }}
        >
          <Box>
            <Typography variant={'h4'}>Publication title</Typography>
            <Typography variant={'h6'} sx={{ fontWeight: 200 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, purus eget tincidunt
              scelerisque, nunc odio dictum tortor, nec aliquet elit nunc id nunc
            </Typography>
          </Box>

          <Box sx={{
            backgroundColor: 'rgba(0,0,0,.5)',
            padding: 1,
            borderRadius: 2,
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box>
              <Typography variant={'h6'} sx={{ fontWeight: 300, color: '#CCC' }}>Date</Typography>
              <Typography variant={'h4'} sx={{ fontWeight: 200, textTransform: 'uppercase' }}>
                12/12/2021
              </Typography>
            </Box>
            <Box sx={{textAlign: 'right'}}>
              <Typography variant={'h6'} sx={{ fontWeight: 300, color: '#CCC' }}>Likes</Typography>
              <Typography variant={'h4'} sx={{ fontWeight: 200, textTransform: 'uppercase' }}>
                124
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default PosterLatestContent


export const StackItem = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1),
  borderRadius: 4,
  ...theme.applyStyles('dark', {
    backgroundColor: '#262B32',
  }),
}));