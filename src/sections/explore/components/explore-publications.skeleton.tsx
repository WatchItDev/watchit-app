import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { ExploreCarouselSkeleton } from '@src/sections/explore/components/explore-carousel.skeleton.tsx';

export const ExplorePublicationsSkeleton: React.FC = () => {
  return (
    <ExploreCarouselSkeleton
      title="Publications"
      SkeletonItemComponent={() => (
        <>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              mb: 1,
              '&::before': {
                content: '""',
                display: 'block',
                paddingTop: '100%', // Forces 1:1 ratio
              },
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                height: '100%',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                borderRadius: 1,
              }}
            />
          </Box>

          <Skeleton variant="text" sx={{ width: '50%' }} />
          <Skeleton variant="text" sx={{ width: '100%' }} />
          <Skeleton variant="text" sx={{ width: '100%' }} />
        </>
      )}
    />
  );
};
