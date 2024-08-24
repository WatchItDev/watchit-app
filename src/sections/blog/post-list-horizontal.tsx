// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
import { IPostItem } from 'src/types/blog';
//
import { PostItemSkeleton } from './post-skeleton';
import PostItemHorizontal from './post-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
  loading?: boolean;
};

export default function PostListHorizontal({ posts, loading }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <PostItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post) => (
        <PostItemHorizontal key={post.id} post={post} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
