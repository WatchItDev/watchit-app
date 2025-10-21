import type { GridItem as GridItemType } from '../../types';

/**
 * Identifies the three kinds of rows the explore grid renders.
 * - `normal`: standard grid row filled with individual items.
 * - `slider`: hybrid row that embeds a 2x2 slider plus regular items.
 * - `expander`: row reserved for the inline player expander.
 */
export type RowType = 'normal' | 'slider' | 'expander';

interface BaseRow {
  key: string;
  type: RowType;
}

/**
 * Represents a standard grid row that only contains individual posts.
 */
export interface NormalRow extends BaseRow {
  type: 'normal';
  cells: GridItemType[];
}

/**
 * Represents a row where a slider occupies a 2x2 block and the remaining cells
 * are filled with standard grid items.
 */
export interface SliderRow extends BaseRow {
  type: 'slider';
  slider: GridItemType;
  grid: Array<Array<GridItemType | null | 'slider'>>;
  sliderColStart: number;
}

/**
 * Represents the inline expander row inserted immediately above the row that
 * triggered it.
 */
export interface ExpanderRow extends BaseRow {
  type: 'expander';
  anchorForRowIndex: number;
}

export type AnyRow = NormalRow | SliderRow | ExpanderRow;
