import CarouselPosterMini           from '@src/components/carousel/variants/carousel-poster-mini';
import { useResponsive }            from '@src/hooks/use-responsive';
import { useGetRecentPostsLazyQuery }from '@src/graphql/generated/hooks';
import { ExplorePublicationsSkeleton } from './explore-publications.skeleton';
import { LoadingFade }              from '@src/components/LoadingFade';
import { memo, useEffect, useState } from 'react';
import { PublicationType } from '@src/components/carousel/types.ts';

// ----------------------------------------------------------------------

const ExplorePublications = () => {
  const lgUp = useResponsive('up', 'lg');
  const [fetchPosts, { loading }] = useGetRecentPostsLazyQuery();
  const [posts, setPosts] = useState<PublicationType[]>([]);

  useEffect(() => {
    console.log("6esty")
    fetchPosts({ variables: { limit: 100 } })
      .then(({ data }) => {
        if (!data?.getRecentPosts) return;
        setPosts(data.getRecentPosts);
      }).catch(console.error);
  }, []);

  const minItemWidth = lgUp ? 250 : 170;
  const maxItemWidth = lgUp ? 350 : 250;

  return (
    <LoadingFade loading={loading && posts.length === 0} skeleton={<ExplorePublicationsSkeleton />}>
      <CarouselPosterMini
        data={posts}
        title="Publications"
        minItemWidth={minItemWidth}
        maxItemWidth={maxItemWidth}
      />
    </LoadingFade>
  );
};

export default memo(ExplorePublications);
