import { useGetRecentPostsQuery } from '@src/graphql/generated/hooks';
import AdaptiveSlider from '../index.tsx';

export default function PopularInRegionSlider(
  props: { span: { w:number; h:number }; cell: number; gapPx?: number }
) {
  const { data, loading } = useGetRecentPostsQuery({ variables: { limit: 24 } });
  const raw = (data as any)?.getRecentPosts ?? [];
  const posts = Array.isArray(raw?.nodes) ? raw.nodes : raw;
  return <AdaptiveSlider title="Popular in your region" posts={posts} loading={loading} {...props} />;
}
