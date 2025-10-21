import type { GridConfig } from '@src/sections/explore/types';
import type { AnyRow, ExpanderRow } from '@src/sections/explore/components/grid/row-types';

const PLAYER_ASPECT_RATIO = 9 / 16;
const PLAYER_MIN_HEIGHT_XS = 280;
const PLAYER_MIN_HEIGHT_MD = 360;
const EXPANDER_EXTRA_VERTICAL = 12;

/**
 * Estimates the inline expander height before the ResizeObserver reports
 * real measurements so the virtualizer can reserve enough space.
 */
export const estimateExpanderHeight = (gridWidth: number, gap: number, config: GridConfig) => {
  const usableWidth = Math.max(0, gridWidth - gap * 2);
  const minHeight =
    gridWidth >= config.breakpoints.tablet ? PLAYER_MIN_HEIGHT_MD : PLAYER_MIN_HEIGHT_XS;
  const playerHeight = usableWidth > 0 ? Math.max(usableWidth * PLAYER_ASPECT_RATIO, minHeight) : minHeight;
  return playerHeight + EXPANDER_EXTRA_VERTICAL;
};

/**
 * Adds the expander row right before the row that triggered it.
 */
export const injectExpanderRow = (
  baseRows: AnyRow[],
  expandedSection: { itemId: string } | null | undefined,
  itemRowIndex: Map<string, number>,
): AnyRow[] => {
  if (!expandedSection) return baseRows;
  const rowIdx = itemRowIndex.get(expandedSection.itemId);
  if (rowIdx == null) return baseRows;
  const rows = baseRows.slice();
  const expanderRow: ExpanderRow = {
    type: 'expander',
    key: `x-${expandedSection.itemId}`,
    anchorForRowIndex: rowIdx,
  };
  rows.splice(rowIdx, 0, expanderRow);
  return rows;
};
