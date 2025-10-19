import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function PopularThisWeekSlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(10, 15);
  return <AdaptiveSlider title="Popular this week" posts={posts} loading={loading} {...props} />;
}
