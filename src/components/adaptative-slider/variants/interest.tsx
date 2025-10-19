import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function ThisCanInterestYouSlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(6, 50);
  return <AdaptiveSlider title="This can interest you" posts={posts} loading={loading} {...props} />;
}
