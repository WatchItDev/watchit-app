import { memo } from 'react';
import { Box } from '@mui/material';
import type { Post } from '@src/graphql/generated/graphql';
import ExploreGridItemCard from '@src/sections/explore/components/explore-grid-item-card';
import type { ExploreGridItemProps } from '@src/sections/explore/types';
import { calculateItemPosition } from '@src/utils/grid';

/**
 * Positions and renders a single explore grid item with animation awareness.
 */
const ExploreGridItem = memo(function ExploreGridItem({
  item,
  gridDimensions,
  rowHeights,
  isExpanded,
  isDimmed,
  onItemClick,
  animationMs,
  anchorRowForOffset,
  expandedOffset,
  transitionsEnabled = true,
}: ExploreGridItemProps) {
  const base = calculateItemPosition(item, gridDimensions, rowHeights);
  const needsOffset = anchorRowForOffset !== null && item.position.y >= anchorRowForOffset;
  const y = needsOffset ? base.y + expandedOffset : base.y;

  const itemWidth =
    item.dimensions.width * gridDimensions.itemSize +
    (item.dimensions.width - 1) * gridDimensions.gap;
  const itemHeight =
    item.dimensions.height * gridDimensions.itemSize +
    (item.dimensions.height - 1) * gridDimensions.gap;

  return (
    <Box
      role="button"
      onClick={() => onItemClick(item)}
      sx={{
        position: 'absolute',
        left: base.x,
        top: y,
        width: itemWidth,
        height: itemHeight,
        borderRadius: 2,
        transition: transitionsEnabled
          ? `top ${animationMs}ms cubic-bezier(0.4,0,0.2,1),
             left ${animationMs}ms cubic-bezier(0.4,0,0.2,1),
             transform ${animationMs}ms`
          : 'none',
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        opacity: isDimmed ? 0.3 : 1,
        zIndex: isExpanded ? 1000 : 1,
        '&:hover': { transform: isExpanded ? 'scale(1.02)' : 'scale(1.03)' },
        willChange: 'top,left,transform',
      }}
    >
      {item.type === 'regular' ? (
        <ExploreGridItemCard
          post={item.data?.post as Post}
          isActive={isExpanded}
          onActivate={() => onItemClick(item)}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%' }} />
      )}
    </Box>
  );
});

export default ExploreGridItem;
