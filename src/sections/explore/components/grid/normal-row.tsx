import Box from '@mui/material/Box';
import GridItemCard from '@src/sections/explore/components/grid-item-card';
import type { Post } from '@src/graphql/generated/graphql';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '../../types';
import { Cell, GridRow } from './grid-layout-primitives';
import type { AnyRow } from './row-types';

interface NormalRowProps {
  row: AnyRow;
  columns: number;
  gap: number;
  itemSize: number;
  expandedSection: ExpandedSectionType | null;
  onGridItemClick: (item: GridItemType) => void;
}

/** Renders a standard row composed exclusively of regular grid items. */
export const NormalRow = ({
  row,
  columns,
  gap,
  itemSize,
  expandedSection,
  onGridItemClick,
}: NormalRowProps) => {
  if (row.type !== 'normal') return null;
  const paddedCells = row.cells.concat(Array.from({ length: Math.max(0, columns - row.cells.length) }) as any);

  return (
    <GridRow $gap={gap} $cols={columns} $itemSizePx={itemSize}>
      {paddedCells.map((cell: GridItemType | undefined, index: number) =>
        cell ? (
          <Cell key={cell.id}>
            <GridItemCard
              post={cell.data?.post as Post}
              isActive={!!expandedSection?.isOpen && expandedSection.itemId === cell.id}
              onActivate={() => onGridItemClick(cell)}
            />
          </Cell>
        ) : (
          <Box key={`placeholder-${index}`} sx={{ width: itemSize, height: itemSize }} />
        ),
      )}
    </GridRow>
  );
};
