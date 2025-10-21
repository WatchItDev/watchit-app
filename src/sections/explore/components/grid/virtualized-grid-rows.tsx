import Box from '@mui/material/Box';
import type { Virtualizer } from '@tanstack/react-virtual';
import type { Post } from '@src/graphql/generated/graphql';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '../../types';
import type { AnyRow } from './row-types';
import { RowBox } from './grid-layout-primitives';
import { NormalRow } from './normal-row';
import { SliderRow } from './slider-row';
import { ExpanderRow } from './expander-row';

interface VirtualizedRowsProps {
  rows: AnyRow[];
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  columns: number;
  itemSize: number;
  gap: number;
  expandedSection: ExpandedSectionType | null;
  hasUserScrolledAfterExpand: boolean;
  items: GridItemType[];
  setExpanderNode: (el: HTMLDivElement | null) => void;
  onGridItemClick: (item: GridItemType) => void;
  onSliderPostSelect: (slider: GridItemType, post: Post | null | undefined) => void;
  onCloseExpanded: () => void;
  animationDuration: number;
  sentinelRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Bridges the virtualizer output with the concrete row renderers.
 */
export function VirtualizedRows({
  rows,
  virtualizer,
  columns,
  itemSize,
  gap,
  expandedSection,
  hasUserScrolledAfterExpand,
  items,
  setExpanderNode,
  onGridItemClick,
  onSliderPostSelect,
  onCloseExpanded,
  animationDuration,
  sentinelRef,
}: VirtualizedRowsProps) {
  return (
    <>
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index];
        const isExpander = row.type === 'expander';
        return (
          <RowBox
            key={row.key}
            data-index={virtualRow.index}
            ref={isExpander ? (setExpanderNode as any) : undefined}
            $dimmed={!!expandedSection && !isExpander && !hasUserScrolledAfterExpand}
            sx={{
              transform: `translateY(${virtualRow.start}px)`,
              minHeight:
                row.type === 'expander' && expandedSection && !expandedSection.isOpen ? gap : undefined,
            }}
          >
            <NormalRow
              row={row}
              columns={columns}
              gap={gap}
              itemSize={itemSize}
              expandedSection={expandedSection}
              onGridItemClick={onGridItemClick}
            />
            <SliderRow
              row={row}
              columns={columns}
              gap={gap}
              itemSize={itemSize}
              expandedSection={expandedSection}
              onGridItemClick={onGridItemClick}
              onSliderPostSelect={onSliderPostSelect}
            />
            <ExpanderRow
              row={row}
              expandedSection={expandedSection}
              items={items}
              gap={gap}
              onCloseExpanded={onCloseExpanded}
              animationDuration={animationDuration}
            />
          </RowBox>
        );
      })}

      {sentinelRef && (
        <Box
          ref={sentinelRef as any}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            top: Math.max(0, virtualizer.getTotalSize() - itemSize),
          }}
        />
      )}
    </>
  );
}
