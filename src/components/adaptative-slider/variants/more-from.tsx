import AdaptiveSlider from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function MoreFromComedySlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { posts, loading } = useSliderPosts(8, 30);
  return <AdaptiveSlider title="More from comedy" posts={posts} loading={loading} {...props} />;
}
