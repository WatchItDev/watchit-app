import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import {useEffect} from "react"
import {setExploreLoading} from "@redux/loading"
import { useDispatch } from 'react-redux';
import { useGetRecentPostsQuery } from '@src/graphql/generated/hooks.tsx';

// ----------------------------------------------------------------------

export const ExplorePublications = () => {
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');
  const { data, loading } = useGetRecentPostsQuery({ variables: { limit: 100 } })

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  useEffect(() => {
    dispatch(setExploreLoading({ key: 'posts', isLoading: loading }));
  }, [loading])

  return (
    <CarouselPosterMini
      data={data?.getRecentPosts ?? []}
      title="Publications"
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
    />
  );
}
