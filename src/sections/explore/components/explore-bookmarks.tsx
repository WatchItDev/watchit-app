import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';

import { useSelector } from 'react-redux';

import { useResponsive } from '@src/hooks/use-responsive.ts';
import {RootState} from "@redux/store.ts"
import {AnyPublication} from "@lens-protocol/api-bindings"
import { useBookmarks } from '@src/hooks/use-bookmark.ts';

// ----------------------------------------------------------------------

export const ExploreBookmarks = () => {
  const lgUp = useResponsive('up', 'lg');
  const { bookmarkPublications, hiddenBookmarks } = useSelector((state: RootState) => state.bookmark);
  const { data: bookmark } = useBookmarks();

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  // Reverse the order of bookmarkPublications
  const reversedBookmarkPublications = [...bookmarkPublications].reverse();
  // Merge reversed publications with the ones from useBookmarks
  const mergedBookmarks = [...reversedBookmarkPublications, ...(bookmark ?? [])];
  // Filter out hidden bookmarks
  const visibleBookmarks = mergedBookmarks.filter(
    (post) => !hiddenBookmarks.some((hidden: AnyPublication) => hidden.id === post.id)
  );
  // Remove posts explicitly marked as hidden
  const nonHiddenBookmarks = visibleBookmarks.filter((post) => !post.isHidden);
  // Remove duplicates based on the id
  const uniqueBookmarks = nonHiddenBookmarks.filter(
    (post, index, self) => index === self.findIndex((p) => p.id === post.id)
  );

  console.log('uniqueBookmarks', uniqueBookmarks);

  return (
    <>
      {!!uniqueBookmarks?.length && (
        <CarouselPosterMini
          data={uniqueBookmarks ?? []}
          title="Bookmarks"
          minItemWidth={minItemWidth}
          maxItemWidth={maxItemWidth}
        />
      )}
    </>
  );
}
