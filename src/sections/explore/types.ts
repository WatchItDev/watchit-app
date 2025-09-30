import type { Post } from '@src/graphql/generated/graphql';

export type GridItemEl = {
  type: 'item';
  id: string;
  post: Post;
};

export type GridSliderEl = {
  type: 'slider';
  id: string;
  label?: string;
  allowedSpans: Array<{ w: number; h: number }>;
  render?: (size: { w: number; h: number; cell: number }) => React.ReactNode;
};

export type GridElement = GridItemEl | GridSliderEl;

export interface GridItem {
  id: string;
  type: 'regular' | 'slider';
  color: string;
  title: string;
  description?: string;
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  data?: any;
}

export interface ExpandedSection {
  itemId: string;
  isOpen: boolean;
  anchorRow: number;
  y: number;
  height: number;
  content?: React.ReactNode;
}

export interface GridDimensions {
  containerWidth: number;
  itemSize: number;
  gap: number;
  columns: number;
  rows: number;
}

export interface GridState {
  items: GridItem[];
  expandedSection: ExpandedSection | null;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  gridDimensions: GridDimensions;
  viewportHeight: number;
  scrollPosition: number;
  isScrolling: boolean;
  hasUserScrolledAfterExpand: boolean;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface GridConfig {
  minItemSize: number;
  maxItemSize: number;
  gap: number;
  breakpoints: ResponsiveBreakpoints;
  itemsPerPage: number;
  animationDuration: number;
  opacityWhenExpanded: number;
  expandedEstimatedHeight?: number;
}

export interface GridItem {
  id: string;
  type: 'regular' | 'slider';
  color: string;
  title: string;
  description?: string;
  dimensions: {
    width: number; // en unidades base (1x1, 2x1, etc.)
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
  data?: any; // datos adicionales del item
}

/**
 * Sección expandida inline, insertada por encima de la fila `anchorRow`.
 * - y: top absoluto (px) de la sección (== topOfRow(anchorRow))
 * - height: alto medido dinámicamente (px)
 */
export interface ExpandedSection {
  itemId: string;
  isOpen: boolean;
  anchorRow: number;
  y: number;
  height: number;
  content?: React.ReactNode;
}

export interface GridDimensions {
  containerWidth: number;
  itemSize: number;
  gap: number;
  columns: number;
  rows: number;
}

export interface GridState {
  items: GridItem[];
  expandedSection: ExpandedSection | null;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  gridDimensions: GridDimensions;
  viewportHeight: number;
  scrollPosition: number;
  isScrolling: boolean;
  hasUserScrolledAfterExpand: boolean;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface GridConfig {
  minItemSize: number;
  maxItemSize: number;
  gap: number;
  breakpoints: ResponsiveBreakpoints;
  itemsPerPage: number;
  animationDuration: number;
  opacityWhenExpanded: number;

  /** Alto estimado para reservar espacio antes del primer paint del expander */
  expandedEstimatedHeight?: number;
}
