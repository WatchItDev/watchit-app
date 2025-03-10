// @mui
import Box from '@mui/material/Box';
import { GovernanceItemSkeleton } from './governance-skeleton.tsx';
import GovernanceItemHorizontal from './governance-item-horizontal.tsx';
import {randomKey} from "@src/utils/uuidv4.ts"

// ----------------------------------------------------------------------

interface Props {
  posts: any[];
  loading?: boolean;
}

export default function GovernanceListHorizontal({ posts, loading }: Readonly<Props>) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <GovernanceItemSkeleton key={randomKey(index, 'item-')} variant="horizontal" />
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
    <Box gap={3} display="grid" gridTemplateColumns="repeat(1, 1fr)">
      {loading ? renderSkeleton : renderList}
    </Box>
  );
}
