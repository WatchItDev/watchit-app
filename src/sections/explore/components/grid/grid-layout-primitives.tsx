import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

/** Lightweight styled primitives shared across the virtualized grid. */

export const ScrollParent = styled(Box)(() => ({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
}));

export const RowsInner = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
}));

export const RowBox = styled(Box)<{ $dimmed?: boolean }>(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
  willChange: 'transform,height',
  contain: 'content',
}));

export const GridRow = styled(Box)<{
  $gap: number;
  $cols: number;
  $itemSizePx: number;
  $isTwoRows?: boolean;
}>(({ $gap, $cols, $itemSizePx, $isTwoRows }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: `repeat(${$cols}, ${$itemSizePx}px)`,
  gridAutoRows: `${$itemSizePx}px`,
  gridTemplateRows: $isTwoRows ? `repeat(2, ${$itemSizePx}px)` : undefined,
  gap: `${$gap}px`,
  paddingLeft: $gap,
  paddingRight: $gap,
}));

export const Cell = styled(Box)(() => ({
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
}));
