import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function TopPicksSlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(8, 0);
  return <AdaptiveSlider title="Top picks" posts={posts} loading={loading} {...props} />;
}
