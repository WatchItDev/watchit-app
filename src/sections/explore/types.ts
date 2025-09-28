import type { ReactNode, RefObject } from 'react';
import type { Post } from '@src/graphql/generated/graphql';

/**
 * Union discriminators describing raw elements that can populate the explore feed.
 */
export type GridElement = GridItemEl | GridSliderEl;

/**
 * Domain model for a slider scheduled within the explore feed grid.
 */
export interface SliderConfig {
  id: string;
  after: number;
  span: { w: number; h: number };
  renderer: (cellSize: number) => ReactNode;
}

/**
 * Describe the reducer actions required by the explore grid presentation layer.
 */
export interface ExploreGridActions {
  setGridDimensions: (dims: GridDimensions) => void;
  setExpandedSection: (section: ExpandedSection | null) => void;
  setExpandedOpen: (isOpen: boolean) => void;
  updateExpandedHeight: (height: number) => void;
  updateExpandedY: (y: number) => void;
  setScrollPosition: (position: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
}

/**
 * Props required by the explore grid presentation component.
 */
export interface ExploreGridPresenterProps {
  items: GridItem[];
  expandedSection: ExpandedSection | null;
  gridDimensions: GridDimensions;
  actions: ExploreGridActions;
  externalLoading?: boolean;
  sentinelRef?: RefObject<HTMLDivElement>;
}

/**
 * Props surface for the Redux-backed explore grid container.
 */
export interface ExploreGridStateConnectorProps {
  externalLoading?: boolean;
  sentinelRef?: RefObject<HTMLDivElement>;
}

/**
 * Result contract for the resize observer hook managing grid dimensions.
 */
export interface UseGridResizeResult {
  gridContainerRef: RefObject<HTMLDivElement>;
  gridWrapperRef: RefObject<HTMLDivElement>;
}

/**
 * Result contract for the layout harmonisation hook.
 */
export interface UseGridLayoutResult {
  harmonizedItems: GridItem[];
  rowHeights: number[];
}

/**
 * Result contract for managing expanded item state within the grid.
 */
export interface UseExpandedSectionResult {
  handleItemClick: (item: GridItem) => void;
  expandedExtraOffset: number;
  expandedItem: GridItem | undefined;
}

/**
 * Parameters required by the expanded section hook.
 */
export interface UseExpandedSectionParams {
  harmonizedItems: GridItem[];
  gridDimensions: GridDimensions;
  expandedSection: ExpandedSection | null;
  setExpandedSection: (section: ExpandedSection | null) => void;
  setExpandedOpen: (isOpen: boolean) => void;
  updateExpandedY: (y: number) => void;
}

/**
 * Handlers leveraged by the scroll synchronisation hook.
 */
export interface GridScrollSyncHandlers {
  setScrollPosition: (position: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
}

/**
 * Props consumed by the slider grid item presentation component.
 */
export interface ExploreGridSliderItemProps {
  item: GridItem;
  sliderMeta?: SliderConfig;
  gridDimensions: GridDimensions;
  expandedSection: ExpandedSection | null;
  expandedExtraOffset: number;
  transitionsEnabled: boolean;
}

/**
 * Props required to render the skeleton placeholder grid.
 */
export interface ExploreGridSkeletonProps {
  columns: number;
  itemSize: number;
  gap: number;
  rows?: number;
}

/**
 * Props passed to the explore grid item component.
 */
export interface ExploreGridItemProps {
  item: GridItem;
  gridDimensions: GridDimensions;
  rowHeights: number[];
  isExpanded: boolean;
  isDimmed: boolean;
  onItemClick: (item: GridItem) => void;
  animationMs: number;
  anchorRowForOffset: number | null;
  expandedOffset: number;
  transitionsEnabled?: boolean;
}

/**
 * Props passed to the inline expanded explore section component.
 */
export interface ExploreGridInlineExpanderProps {
  top: number;
  width?: number;
  open: boolean;
  animationMs: number;
  onMeasured: (height: number) => void;
  post?: Post;
}

/**
 * Props consumed by the legacy expanded section component.
 */
export interface ExploreGridLegacySectionProps {
  expandedSection: ExpandedSection;
  item: GridItem;
  onRequestClose: () => void;
  onAfterClose?: () => void;
  animationDuration: number;
}

/**
 * Props for the expander info panel that wraps the publication player.
 */
export interface ExploreGridMediaPanelProps {
  post: Post;
}

/**
 * Props accepted by the grid item card component.
 */
export interface ExploreGridItemCardProps {
  post: Post;
  onActivate?: (post: Post, originEl?: HTMLElement) => void;
  isActive?: boolean;
}

/**
 * Props for the slider placeholder visual component.
 */
export interface ExploreGridSliderPlaceholderProps {
  label?: string;
}

/**
 * Raw feed item representation (non-slider) used while building grid state.
 */
export interface GridItemEl {
  type: 'item';
  id: string;
  post: Post;
}

/**
 * Raw slider representation used while building grid state.
 */
export interface GridSliderEl {
  type: 'slider';
  id: string;
  label?: string;
  allowedSpans: Array<{ w: number; h: number }>;
  render?: (size: { w: number; h: number; cell: number }) => ReactNode;
}

/**
 * Adapted grid item consumed directly by the explore grid renderer.
 */
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

/**
 * Shape of the inline expanded section within the explore feed.
 */
export interface ExpandedSection {
  itemId: string;
  isOpen: boolean;
  anchorRow: number;
  y: number;
  height: number;
  content?: ReactNode;
}

/**
 * Computed layout details describing the virtual grid.
 */
export interface GridDimensions {
  containerWidth: number;
  itemSize: number;
  gap: number;
  columns: number;
  rows: number;
}

/**
 * Aggregate Redux state tracked for the explore grid module.
 */
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

/**
 * Breakpoint set used to adapt the grid to screen sizes.
 */
export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

/**
 * Configuration used to derive responsive grid behaviour.
 */
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
