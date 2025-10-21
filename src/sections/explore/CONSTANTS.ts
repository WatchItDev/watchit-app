import { icons } from '@tabler/icons-react';
import { GridConfig, ReactionValue } from '@src/sections/explore/types';

/** Default responsive configuration for the explore virtualized grid. */
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

const { IconThumbDown, IconHeart, IconFlame, IconStars } = icons;

export const INFO_PANEL_WIDTH_DESKTOP = 360;
export const INFO_PANEL_HEIGHT_DESKTOP = 400;
export const INFO_PANEL_HEIGHT_MOBILE = 320;
export const INFO_PANEL_HEIGHT_RATIO = 0.9;
export const INFO_PANEL_MIN_HEIGHT = 220;
export const MIN_PLAYER_HEIGHT_XS = 280;
export const MIN_PLAYER_HEIGHT_MD = 360;

export const REACTIONS: Array<{
  value: ReactionValue;
  label: string;
  icon: typeof IconHeart;
  color: string;
  price?: number;
}> = [
  { value: 'hate', label: 'Dislike', icon: IconThumbDown, color: '#ef5350' },
  { value: 'love', label: 'Like', icon: IconHeart, color: '#f06292' },
  { value: 'super_like', label: 'Super Like', icon: IconFlame, color: '#ff9100', price: 10 },
  { value: 'mega_fan', label: 'Mega Fan', icon: IconStars, color: '#ffd600', price: 50 },
];

export const SPONSOR_MOCKS: Array<{ name: string; logo: string }> = [
  { name: 'Neon Labs', logo: 'https://placehold.co/120x40?text=Neon+Labs' },
  { name: 'Galaxy Media', logo: 'https://placehold.co/120x40?text=Galaxy' },
  { name: 'Aurora Co.', logo: 'https://placehold.co/120x40?text=Aurora' },
  { name: 'Echo Studios', logo: 'https://placehold.co/120x40?text=Echo' },
];

export const formatNumber = (value?: number | null) =>
  value ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value) : '0';
