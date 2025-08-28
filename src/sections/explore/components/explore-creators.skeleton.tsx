import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { ExploreCarouselSkeleton } from '@src/sections/explore/components/explore-carousel.skeleton.tsx';

const SkeletonItem = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: 1,
        borderRadius: '1rem',
        mb: 1,
      }}
    >
      <Skeleton
        data-testid="skeleton-item"
        variant="rectangular"
        sx={{
          borderRadius: 1,
          width: '100%',
          height: '8rem',
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          position: 'absolute',
          top: '6rem',
          left: '1.5rem',
          width: '3rem',
          height: '3rem',
          borderRadius: 1,
        }}
      />
      <Skeleton variant="text" sx={{ width: '50%', mt: 2 }} />
      <Skeleton variant="text" sx={{ width: '100%' }} />
    </Box>
  );
};

export const ExploreCreatorsSkeleton: React.FC = () => {
  return (
    <ExploreCarouselSkeleton
      title="Latest creators"
      SkeletonItemComponent={SkeletonItem}
    />
  );
};
