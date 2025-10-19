import AdaptiveSlider, { type SliderVariantProps } from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function MoreFromComedySlider(props: SliderVariantProps) {
  const { posts, loading } = useSliderPosts(8, 30);
  return <AdaptiveSlider title="More from comedy" posts={posts} loading={loading} {...props} />;
}
