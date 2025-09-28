import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addItems, resetGrid } from '@redux/grid';
import { useInfiniteFeed } from '@src/hooks/use-infinite-feed';
import { FEED_MIN_REGULAR_COUNT } from '@src/sections/explore/CONSTANTS';
import { postsToGridItems } from './explore-grid-content';
import ExploreGridStateConnector from './explore-grid-state-connector';

/**
 * Bridges the infinite feed hook with the dynamic grid, adapting posts into grid items.
 */

const ExploreGridFeedContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { items: posts, loading, sentinelRef } = useInfiniteFeed(30);

  useEffect(() => {
    dispatch(resetGrid());
  }, [dispatch]);

  useEffect(() => {
    if (!posts?.length) return;
    const nextItems = postsToGridItems(posts, FEED_MIN_REGULAR_COUNT);
    dispatch(addItems(nextItems));
  }, [posts, dispatch]);

  return (
    <Box sx={{ p: 2 }}>
      <ExploreGridStateConnector externalLoading={loading} sentinelRef={sentinelRef} />
    </Box>
  );
};

export default ExploreGridFeedContainer;
