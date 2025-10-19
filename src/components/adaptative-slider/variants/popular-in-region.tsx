import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function PopularInRegionSlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(6, 38);
  return <AdaptiveSlider title="Popular in your region" posts={posts} loading={loading} {...props} />;
}
