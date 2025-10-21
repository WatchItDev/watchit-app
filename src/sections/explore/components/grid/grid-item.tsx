import { memo, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import type { GridItem as GridItemType } from '../../types';
import { calculateItemPosition } from '@src/utils/grid';
import { StyledGridItem, ItemContent } from './grid-item.styles';

interface GridItemProps {
  item: GridItemType;
  gridDimensions: any;
  rowHeights: number[];
  isExpanded: boolean;
  isDimmed: boolean;
  onItemClick: (item: GridItemType) => void;
  animationDuration: number;
  anchorRowForOffset: number | null;
  expandedOffset: number;
  transitionsEnabled?: boolean;
}

/**
 * Legacy grid item placeholder preserved for compatibility with static layouts.
 */
const GridItem = memo(
  ({
    item,
    gridDimensions,
    rowHeights,
    isExpanded,
    isDimmed,
    onItemClick,
    animationDuration,
    anchorRowForOffset,
    expandedOffset,
    transitionsEnabled = true,
  }: GridItemProps) => {
    const handleClick = useCallback(() => onItemClick(item), [item, onItemClick]);

    const base = calculateItemPosition(item, gridDimensions, rowHeights);
    const needsOffset = anchorRowForOffset !== null && item.position.y >= anchorRowForOffset;
    const top = needsOffset ? base.y + expandedOffset : base.y;

    const width = item.dimensions.width * gridDimensions.itemSize + (item.dimensions.width - 1) * gridDimensions.gap;
    const height = item.dimensions.height * gridDimensions.itemSize + (item.dimensions.height - 1) * gridDimensions.gap;

    return (
      <StyledGridItem
        isExpanded={isExpanded}
        isDimmed={isDimmed}
        animationDuration={animationDuration}
        transitionsEnabled={transitionsEnabled}
        style={{ left: base.x, top, width, height, backgroundColor: item.color }}
        onClick={handleClick}
      >
        <ItemContent>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {item.title}
          </Typography>
          {item.description && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {item.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{ position: 'absolute', bottom: 8, right: 8, opacity: 0.7, fontSize: '0.7rem' }}
          >
            {item.dimensions.width}×{item.dimensions.height}
          </Typography>
        </ItemContent>
      </StyledGridItem>
    );
  },
);

GridItem.displayName = 'GridItem';
export default GridItem;
