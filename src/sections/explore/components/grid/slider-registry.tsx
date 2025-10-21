import type { Post } from '@src/graphql/generated/graphql';
import TopPicksSlider from '@src/components/adaptative-slider/variants/top-picks';
import ContinueWatchingSlider from '@src/components/adaptative-slider/variants/continue-watching';
import PopularThisWeekSlider from '@src/components/adaptative-slider/variants/popular-this-week';
import MoreFromComedySlider from '@src/components/adaptative-slider/variants/more-from';
import PopularInRegionSlider from '@src/components/adaptative-slider/variants/popular-in-region';
import ThisCanInterestYouSlider from '@src/components/adaptative-slider/variants/interest';

type SliderComponentProps = {
  span: { w: number; h: number };
  cell: number;
  gapPx: number;
  onPostSelect?: (post: Post) => void;
};

type SliderRenderer = (props: SliderComponentProps) => JSX.Element | null;

const registry: Record<string, SliderRenderer> = {
  'top-picks': (props) => <TopPicksSlider {...props} />,
  'continue-watching': (props) => <ContinueWatchingSlider {...props} />,
  'popular-week': (props) => <PopularThisWeekSlider {...props} />,
  comedy: (props) => <MoreFromComedySlider {...props} />,
  region: (props) => <PopularInRegionSlider {...props} />,
  interest: (props) => <ThisCanInterestYouSlider {...props} />,
};

/**
 * Returns the slider component registered for the given identifier.
 */
export const renderSliderById = (id: string | undefined, props: SliderComponentProps) => {
  if (!id) return null;
  const renderer = registry[id];
  return renderer ? renderer(props) : null;
};
