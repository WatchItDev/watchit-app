import AdaptiveSlider from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function ThisCanInterestYouSlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { posts, loading } = useSliderPosts(6, 50);
  return <AdaptiveSlider title="This can interest you" posts={posts} loading={loading} {...props} />;
}
