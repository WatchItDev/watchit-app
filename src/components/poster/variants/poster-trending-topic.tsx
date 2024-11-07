// @mui
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import {TrendingTopics} from "@src/sections/explore/view.tsx";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const PosterTrendingTopic = ({ id, title, image, desc }: TrendingTopics) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.movie.details(String(id)));
  }

  return (
    <Paper
      sx={{
        marginBottom: 4,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor:'transparent',
        cursor: 'pointer'
      }}
      onClick={handlePosterClick}
    >
        <Stack
            direction="row"
            spacing={0}
        >
          <Item>
            {/* Poster image */}
           <Box sx={{
             width: '150px'
           }} >
             <Image style={{borderRadius:'10px'}} alt={title} src={image} ratio='1/1' />
           </Box>
          </Item>
          <Item>
            <Typography style={{fontSize: 'clamp(0.5rem, 1vw, 2rem)', textOverflow: 'clip', wordWrap: 'break-word'  }} noWrap variant='h6' sx={{ mb: 1 }}>
              {title}
            </Typography>
            {/* Details: Desc */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
                { desc }
              </Typography>
            </Stack>
          </Item>
        </Stack>
    </Paper>
  );
}

export default PosterTrendingTopic


const Item = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1),
  borderRadius: 4,
  ...theme.applyStyles('dark', {
    backgroundColor: '#262B32',
  }),
}));
