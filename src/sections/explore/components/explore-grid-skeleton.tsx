import React from 'react';
import { Box, Skeleton } from '@mui/material';
import type { ExploreGridSkeletonProps } from '@src/sections/explore/types';

/**
 * Lightweight placeholder displayed while the explore feed loads.
 */
const ExploreGridSkeleton: React.FC<ExploreGridSkeletonProps> = ({ columns, itemSize, gap, rows = 6 }) => {
  const count = Math.max(1, columns * rows);

  return (
    <Box sx={{ position: 'absolute', left: gap, right: gap, top: gap }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px` }}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={itemSize} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    </Box>
  );
};

export default ExploreGridSkeleton;
