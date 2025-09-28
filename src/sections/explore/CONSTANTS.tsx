import TopPicksSlider from '@src/components/adaptative-slider/variants/top-picks';
import ContinueWatchingSlider from '@src/components/adaptative-slider/variants/continue-watching';
import MoreFromComedySlider from '@src/components/adaptative-slider/variants/more-from';
import PopularInRegionSlider from '@src/components/adaptative-slider/variants/popular-in-region';
import PopularThisWeekSlider from '@src/components/adaptative-slider/variants/popular-this-week';
import ThisCanInterestYouSlider from '@src/components/adaptative-slider/variants/interest';
import type { GridConfig, SliderConfig } from '@src/sections/explore/types';

/**
 * Grid sizing and spacing defaults for the explore feed layout.
 */
export const GRID_CONFIG: GridConfig = {
  minItemSize: 220,
  maxItemSize: 360,
  gap: 12,
  breakpoints: { mobile: 768, tablet: 1024, desktop: 1200 },
  itemsPerPage: 20,
  animationDuration: 300,
  opacityWhenExpanded: 0.3,
  expandedEstimatedHeight: 360,
};

/**
 * Minimum number of regular feed items required to hydrate the layout harmoniously.
 */
export const FEED_MIN_REGULAR_COUNT = 120;

/**
 * Fade duration for the legacy expanded section overlay.
 */
export const EXPANDED_SECTION_FADE_MS = 180;

/**
 * Static configuration describing slider insertions within the explore grid.
 */
export const EXPLORE_SLIDERS: SliderConfig[] = [
  {
    id: 'top-picks',
    after: 3,
    span: { w: 2, h: 2 },
    renderer: (cell) => <TopPicksSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
  {
    id: 'continue-watching',
    after: 12,
    span: { w: 2, h: 2 },
    renderer: (cell) => <ContinueWatchingSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
  {
    id: 'popular-week',
    after: 22,
    span: { w: 2, h: 2 },
    renderer: (cell) => <PopularThisWeekSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
  {
    id: 'comedy',
    after: 35,
    span: { w: 2, h: 2 },
    renderer: (cell) => <MoreFromComedySlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
  {
    id: 'region',
    after: 48,
    span: { w: 2, h: 2 },
    renderer: (cell) => <PopularInRegionSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
  {
    id: 'interest',
    after: 60,
    span: { w: 2, h: 2 },
    renderer: (cell) => <ThisCanInterestYouSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} />,
  },
];

/**
 * Minimum player heights for the expanded expander component per breakpoint.
 */
export const EXPANDER_MIN_HEIGHT = {
  xs: 280,
  md: 360,
} as const;
