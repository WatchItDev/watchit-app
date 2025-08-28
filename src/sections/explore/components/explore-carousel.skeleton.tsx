import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { Box } from '@mui/material';
import { useResponsive } from '@src/hooks/use-responsive';
import { useItemsPerSlide } from '@src/hooks/components/use-item-per-slide';
import { ExploreCarouselSkeletonProps } from '@src/sections/explore/types.ts';
import { randomKey } from "@src/utils/uuidv4.ts"

export const ExploreCarouselSkeleton: React.FC<ExploreCarouselSkeletonProps> = (props) => {
  const { title, SkeletonItemComponent = Box } = props;
  // Mirror the responsive logic from your real component
  const lgUp = useResponsive('up', 'lg');
  const minItemWidth = lgUp ? 250 : 170;
  const maxItemWidth = lgUp ? 350 : 250;

  // This hook calculates how many items fit per row
  const { itemsPerSlide, parentRef } = useItemsPerSlide({
    minItemWidth,
    maxItemWidth,
  });

  // We want exactly two rows
  const totalItems = itemsPerSlide * 2;
  const skeletonItems = Array.from({ length: totalItems });

  // Split into row1 and row2
  const row1 = skeletonItems.slice(0, itemsPerSlide);
  const row2 = skeletonItems.slice(itemsPerSlide);

  // Each item in a row uses the same width percentage
  const itemWidthPercent = 100 / itemsPerSlide;

  return (
    <Card sx={{ p: 0 }}>
      <CardHeader sx={{ px: 1.5 }} title={title} />
      <CardContent sx={{ px: 0.5 }}>
        <Box ref={parentRef} sx={{ overflow: 'hidden' }}>
          {[row1, row2].map((rowItems, rowIndex) => (
            <Box key={`${randomKey(rowIndex, 'row-')}`} sx={{ display: 'flex' }}>
              {rowItems.map((_, itemIndex) => (
                <Box
                  key={`${randomKey(itemIndex, 'item-')}`}
                  sx={{
                    flexBasis: `${itemWidthPercent}%`,
                    maxWidth: `${itemWidthPercent}%`,
                    p: 1,
                  }}
                  data-testid="skeleton-item"
                >
                  <SkeletonItemComponent />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
