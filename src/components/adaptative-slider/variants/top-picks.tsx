import { useSliderPosts } from '../use-slider-posts';
import AdaptiveSlider from '../index.tsx';

export default function TopPicksSlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { posts, loading } = useSliderPosts(8, 0);
  return <AdaptiveSlider title="Top picks" posts={posts} loading={loading} {...props} />;
}
