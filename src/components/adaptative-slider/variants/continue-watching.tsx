import AdaptiveSlider from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function ContinueWatchingSlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { posts, loading } = useSliderPosts(7, 8);
  return <AdaptiveSlider title="Continue watching" posts={posts} loading={loading} {...props} />;
}
