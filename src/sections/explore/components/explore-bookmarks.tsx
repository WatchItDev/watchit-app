import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useBookmarks } from '@src/hooks/use-bookmark.ts';
import { Post } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export const ExploreBookmarks = () => {
  const lgUp = useResponsive('up', 'lg');
  const { data: bookmarks, loading } = useBookmarks();

  if (loading || !bookmarks.length) return null;

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  const visible = bookmarks.filter((p: Post) => !p.hidden);

  console.log('uniqueBookmarks', visible);

  return (
    <>
      {!!visible?.length && (
        <CarouselPosterMini
          data={visible ?? []}
          title="Bookmarks"
          minItemWidth={minItemWidth}
          maxItemWidth={maxItemWidth}
        />
      )}
    </>
  );
}
