// ProfileHome.js
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProfilePublicationItem } from './profile-publication-item';

interface ProfileHomeProps {
  publications: any;
  noPaddings?: boolean
}

export default function ProfileHome({ publications, noPaddings = false}: ProfileHomeProps) {
  const minItemWidth = 150;
  const maxItemWidth = 200;
  const gap = 16; // Espacio entre ítems

  const calculateItemWidth = () => {
    const containerWidth = window.innerWidth;
    const itemsPerRow = Math.floor((containerWidth + gap) / (maxItemWidth + gap));
    const itemWidth = (containerWidth - (itemsPerRow - 1) * gap) / itemsPerRow;

    return Math.min(Math.max(itemWidth, minItemWidth), maxItemWidth);
  };

  const [itemWidth, setItemWidth] = useState(calculateItemWidth());

  useEffect(() => {
    const handleResize = () => setItemWidth(calculateItemWidth());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log('publications')
  console.log(publications)

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap}px`,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: noPaddings ? 0 : 2,
      }}
    >
      {publications?.map((publication) => (
        <Box
          key={publication.id}
          sx={{
            // display: { xs: 'block', sm: 'flex' },
            // gap: `${gap}px`,
            flex: `0 1 ${itemWidth}px`,
            maxWidth: `${maxItemWidth}px`,
          }}
        >
          {/*<ProfilePublicationItem publication={publication} />*/}
          <ProfilePublicationItem publication={publication} />
        </Box>
      ))}

      {!publications?.length && (
        <Typography
          sx={{
            height: '20rem',
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            background: '#2b2d31',
            borderRadius: '1rem',
          }}
        >
          This profile has no posts
        </Typography>
      )}
    </Box>
  );
}
