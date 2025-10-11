import AdaptiveSlider from '../index.tsx';
import { useSliderPosts } from '../use-slider-posts';

export default function PopularInRegionSlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { posts, loading } = useSliderPosts(6, 38);
  return <AdaptiveSlider title="Popular in your region" posts={posts} loading={loading} {...props} />;
}
