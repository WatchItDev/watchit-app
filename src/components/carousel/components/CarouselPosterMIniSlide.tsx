import Box from '@mui/material/Box';
import PosterHorizontal from '@src/components/poster/variants/poster-horizontal.tsx';
import {CarouselPosterSlideProps} from "@src/components/carousel/variants/types.ts";
// @ts-ignore
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";

export default function CarouselPosterSlide({ items, itemsPerRow }: CarouselPosterSlideProps) {
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  const getMediaUri = (cid: string): string => `${cid}`;
  const getWallpaperCid = (post: Post): string =>
    post?.metadata?.attachments?.find((el: Post) => el.altTag === 'wallpaper')?.image?.raw?.uri;
  const getPosterCid = (post: Post): string =>
    post?.metadata?.attachments?.find((el: Post) => el.altTag === 'poster')?.image?.raw?.uri;

  return (
    <Box>
      {[row1, row2].map((rowItems, rowIndex) => (
        <Box key={`row-publications-${rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((post) => (
            <Box
              key={post.id}
              sx={{
                flexBasis: `${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                p: 1,
              }}
            >
              <PosterHorizontal
                id={post.id}
                title={post.metadata.title}
                images={{
                  vertical: getMediaUri(getPosterCid(post)),
                  wallpaper: getMediaUri(getWallpaperCid(post)),
                }}
                likes={post.globalStats.upvotes}
                synopsis={post.metadata.content}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
