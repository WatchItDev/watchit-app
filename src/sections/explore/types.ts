import type { ReactNode } from 'react';
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
  render?: (size: { w: number; h: number; cell: number }) => ReactNode;
};

export type GridElement = GridItemEl | GridSliderEl;

/** Base properties shared by the virtualized grid items. */
export interface GridItem {
  id: string;
  type: 'regular' | 'slider';
  color: string;
  title: string;
  description?: string;
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  data?: unknown;
}

/** Inline expander metadata inserted between grid rows. */
export interface ExpandedSection {
  itemId: string;
  isOpen: boolean;
  anchorRow: number;
  y: number;
  height: number;
  content?: ReactNode;
  selectedPost?: Post | null;
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

export type SidePanelKey = 'comments' | 'bakers' | 'sponsors';

export type ReactionValue = 'hate' | 'love' | 'super_like' | 'mega_fan';

export type ExplorePost = Post & {
  author: {
    id?: number | null;
    address?: string;
    displayName?: string;
    username?: string;
    profilePicture?: string;
    coverPicture?: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
    publicationsCount?: number;
  };
  description?: string;
  likeCount?: number;
  bookmarkCount?: number;
  commentCount?: number;
  viewCount?: number;
  shareCount?: number;
  cid?: string;
  media?: Array<{
    id: string;
    cid: string;
    title?: string;
    type?: string;
    url?: string;
  }>;
};

export interface ExpanderPlayerInfoProps {
  post?: Post | null;
  onPlayerControlsVisibilityChange?: (visible: boolean) => void;
}
