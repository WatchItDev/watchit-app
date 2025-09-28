import React, { memo } from 'react';
import { Box } from '@mui/material';
import type { ExploreGridSliderItemProps } from '@src/sections/explore/types';
import { GRID_CONFIG } from '@src/sections/explore/CONSTANTS';

/**
 * Renders a slider cell positioned within the absolute grid layout.
 */

const ExploreGridSliderItem: React.FC<ExploreGridSliderItemProps> = ({
  item,
  sliderMeta,
  gridDimensions,
  expandedSection,
  expandedExtraOffset,
  transitionsEnabled,
}) => {
  if (!sliderMeta) return null;

  const cellSize = gridDimensions.itemSize;
  const baseX = gridDimensions.gap + item.position.x * (gridDimensions.itemSize + gridDimensions.gap);
  const baseY = gridDimensions.gap + item.position.y * (gridDimensions.itemSize + gridDimensions.gap);
  const needsOffset = expandedSection && item.position.y >= expandedSection.anchorRow;
  const top = needsOffset ? baseY + expandedExtraOffset : baseY;

  const widthPx = item.dimensions.width * gridDimensions.itemSize + (item.dimensions.width - 1) * gridDimensions.gap;
  const heightPx = item.dimensions.height * gridDimensions.itemSize + (item.dimensions.height - 1) * gridDimensions.gap;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: baseX,
        top,
        width: widthPx,
        height: heightPx,
        transition: transitionsEnabled
          ? `top ${GRID_CONFIG.animationDuration}ms cubic-bezier(0.4,0,0.2,1), left ${GRID_CONFIG.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
          : 'none',
        willChange: 'top,left',
      }}
    >
      {sliderMeta.renderer(cellSize)}
    </Box>
  );
};

export default memo(ExploreGridSliderItem);
