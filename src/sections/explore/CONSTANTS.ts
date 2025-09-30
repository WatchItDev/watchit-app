import { GridConfig } from '@src/sections/explore/types.ts';

export const GRID_CONFIG: GridConfig = {
  minItemSize: 220,
  maxItemSize: 360,
  gap: 12,
  breakpoints: { mobile: 768, tablet: 1024, desktop: 1200 },
  itemsPerPage: 20,
  animationDuration: 300,
  opacityWhenExpanded: 0.3,
  expandedEstimatedHeight: 1000,
};
