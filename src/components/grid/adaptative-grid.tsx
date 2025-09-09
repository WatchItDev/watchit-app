import React, { ReactNode, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { Breakpoint } from '@mui/material/styles';

// ---------------- Types ----------------
export type Span = Partial<Record<Breakpoint, number>>; // number of grid cells to span

export type GridItemRenderArgs = { width: number; height: number };

export type GridItemProps = {
  /** Column span for each breakpoint (multiple of base cell). Enforced min 2. */
  colSpan?: Span;
  /** Row span for each breakpoint (multiple of base row unit). Enforced min 2. */
  rowSpan?: Span;
  /** Optional fixed height (px). If present, overrides rowSpan height. */
  fixedHeight?: number;
  /** Children or render function receiving the measured size. */
  children: ReactNode | ((args: GridItemRenderArgs) => ReactNode);
  /** Extra styles */
  sx?: any;
};

export type AdaptiveGridProps = {
  /** Columns per breakpoint. */
  columns?: Partial<Record<Breakpoint, number>>;
  /** Base cell; each item must be at least 2x2 cells. */
  baseCell?: number; // default 2
  /** Space between items (px or theme spacing). */
  gap?: number | string;
  /** Height of a single row unit in pixels. */
  rowUnitHeight?: number; // default 48
  /** Children must be GridItem nodes. */
  children: ReactNode;
  /** Optional styles */
  sx?: any;
};

// ---------------- Utils ----------------
const even = (n: number) => (n % 2 === 0 ? n : n + 1);
const atLeastTwo = (n: number) => Math.max(2, even(n));

// Size observer (width/height of a tile)
const useSize = (elementRef: React.RefObject<HTMLElement>) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [elementRef]);
  return size;
};

// ---------------- GridItem ----------------
export const GridItem: React.FC<GridItemProps> = ({ colSpan, rowSpan, fixedHeight, children, sx }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(ref);

  const content = React.useMemo(() => {
    if (typeof children === 'function') return (children as any)({ width, height });
    return children;
  }, [children, width, height]);

  const gridColumn = React.useMemo(() => {
    const out: any = {};
    if (colSpan) Object.entries(colSpan).forEach(([bp, v]) => (out[bp] = `span ${atLeastTwo(v as number)}`));
    return out;
  }, [colSpan]);

  const gridRow = React.useMemo(() => {
    const out: any = {};
    if (rowSpan) Object.entries(rowSpan).forEach(([bp, v]) => (out[bp] = `span ${atLeastTwo(v as number)}`));
    return out;
  }, [rowSpan]);

  return (
    <Box
      ref={ref}
      sx={{
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gridColumn,
        gridRow,
        ...(fixedHeight ? { height: fixedHeight } : {}),
        ...sx,
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0 }}>{content}</Box>
    </Box>
  );
};

// ---------------- AdaptiveGrid ----------------
export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
                                                            columns = { xs: 8, sm: 8, md: 12, lg: 12, xl: 12 },
                                                            baseCell = 2,
                                                            gap = 8,
                                                            rowUnitHeight = 48,
                                                            children,
                                                            sx,
                                                          }) => {
  // Normalize columns: ensure even & >= base*2
  const normalizedCols = useMemo(() => {
    const out: any = {};
    Object.entries(columns).forEach(([bp, v]) => {
      const safe = Math.max(baseCell * 2, atLeastTwo(v as number));
      out[bp] = `repeat(${safe}, minmax(0, 1fr))`;
    });
    return out;
  }, [columns, baseCell]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: normalizedCols,
        gridAutoRows: rowUnitHeight,
        gridAutoFlow: 'dense',
        gap,
        width: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
