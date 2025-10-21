import Box from '@mui/material/Box';
import GridItemCard from '@src/sections/explore/components/grid-item-card';
import type { Post } from '@src/graphql/generated/graphql';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '../../types';
import { Cell, GridRow } from './grid-layout-primitives';
import { renderSliderById } from './slider-registry';
import type { AnyRow } from './row-types';

interface SliderRowProps {
  row: AnyRow;
  columns: number;
  gap: number;
  itemSize: number;
  expandedSection: ExpandedSectionType | null;
  onGridItemClick: (item: GridItemType) => void;
  onSliderPostSelect: (slider: GridItemType, post: Post | null | undefined) => void;
}

/** Renders a row that embeds a two-by-two slider alongside regular items. */
export const SliderRow = ({
  row,
  columns,
  gap,
  itemSize,
  expandedSection,
  onGridItemClick,
  onSliderPostSelect,
}: SliderRowProps) => {
  if (row.type !== 'slider') return null;

  return (
    <GridRow $gap={gap} $cols={columns} $itemSizePx={itemSize} $isTwoRows>
      {row.grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          const key = `${rowIndex}-${colIndex}`;
          if (cell === 'slider') {
            if (rowIndex === 0 && colIndex === row.sliderColStart) {
              const sliderId =
                (row.slider.data as { sliderId?: string } | undefined)?.sliderId ??
                row.slider.id.replace(/^slider-/, '');
              return (
                <Cell
                  key={`slider-${row.slider.id}`}
                  sx={{ gridColumn: `${row.sliderColStart + 1} / span 2`, gridRow: '1 / span 2' }}
                >
                  {renderSliderById(sliderId, {
                    span: { w: 2, h: 2 },
                    cell: itemSize,
                    gapPx: gap,
                    onPostSelect: (post) => onSliderPostSelect(row.slider, post),
                  })}
                </Cell>
              );
            }
            return null;
          }
          if (cell) {
            return (
              <Cell key={cell.id} onClick={() => onGridItemClick(cell)}>
                <GridItemCard
                  post={cell.data?.post as Post}
                  isActive={!!expandedSection && expandedSection.itemId === cell.id}
                  onActivate={() => onGridItemClick(cell)}
                />
              </Cell>
            );
          }
          return <Box key={key} sx={{ width: itemSize, height: itemSize }} />;
        }),
      )}
    </GridRow>
  );
};
