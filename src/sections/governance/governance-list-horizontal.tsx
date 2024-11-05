// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
import { IPostItem } from '@src/types/blog';
//
import { GovernanceItemSkeleton } from './governance-skeleton';
import GovernanceItemHorizontal from './governance-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  posts: any[];
  loading?: boolean;
};

export default function GovernanceListHorizontal({ posts, loading }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <GovernanceItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post) => (
        <GovernanceItemHorizontal key={post.id} post={post} />
      ))}
    </>
  );

  return (
    <Box
        gap={3}
        display="grid"
        gridTemplateColumns="repeat(1, 1fr)"
      >
        {loading ? renderSkeleton : renderList}
    </Box>
  );
}
