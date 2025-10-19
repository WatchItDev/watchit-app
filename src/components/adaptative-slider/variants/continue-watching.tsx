import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function ContinueWatchingSlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(7, 8);
  return <AdaptiveSlider title="Continue watching" posts={posts} loading={loading} {...props} />;
}
