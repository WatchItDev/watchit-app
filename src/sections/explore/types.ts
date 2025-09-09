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
  /** De mayor a menor. w/h en celdas (no en px). */
  allowedSpans: Array<{ w: number; h: number }>;
  /** Render propio del slider (opcional). */
  render?: (size: { w: number; h: number; cell: number }) => React.ReactNode;
};

export type GridElement = GridItemEl | GridSliderEl;

export type PlacedNode = {
  el: GridElement;
  x: number; // columna inicial (0-index)
  y: number; // fila inicial (0-index)
  w: number; // celdas de ancho
  h: number; // celdas de alto
};
