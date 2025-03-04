import CarouselPosterMini from '@src/components/carousel/variants/CarouselPosterMini.tsx';

import { useBookmarks } from '@lens-protocol/react-web';
import { useSelector } from 'react-redux';

import { useResponsive } from '@src/hooks/use-responsive.ts';

// ----------------------------------------------------------------------

export const ExploreBookmarks = () => {
  const lgUp = useResponsive('up', 'lg');
  const { bookmarkPublications, hiddenBookmarks } = useSelector((state: any) => state.bookmark);
  const { data: bookmark } = useBookmarks();

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  const bookmarksFiltered = [...[...bookmarkPublications].reverse(), ...(bookmark ?? [])]
    .filter((post) => !hiddenBookmarks.some((hidden: any) => hidden.id === post.id))
    .filter((post) => !post.isHidden)
    .filter((post, index, self) => index === self.findIndex((p) => p.id === post.id));

  return (
    <>
      {!!bookmarksFiltered?.length && (
        <CarouselPosterMini
          data={bookmarksFiltered ?? []}
          title="Bookmarks"
          minItemWidth={minItemWidth}
          maxItemWidth={maxItemWidth}
        />
      )}
    </>
  );
}
