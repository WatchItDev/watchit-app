import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';

import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';

import { useResponsive } from '@src/hooks/use-responsive.ts';
import {useEffect} from "react"
import {setExploreLoading} from "@redux/loading"
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export const ExplorePublications = () => {
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');
  const { data, loading } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

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
      data={data ?? []}
      title="Publications"
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
    />
  );
}
