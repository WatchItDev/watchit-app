import React, { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setExpandedOpen,
  setExpandedSection,
  setGridDimensions,
  setIsScrolling,
  setScrollPosition,
  updateExpandedHeight,
  updateExpandedY,
} from '@redux/grid';
import type { RootState } from '@redux/store.ts';
import type {
  ExploreGridActions,
  ExploreGridStateConnectorProps,
} from '@src/sections/explore/types';
import ExploreGridPresenter from './explore-grid-presenter';

/**
 * Connects the explore grid presentation layer with Redux derived state.
 */

const ExploreGridStateConnector: React.FC<ExploreGridStateConnectorProps> = ({ externalLoading, sentinelRef }) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.grid.items);
  const expandedSection = useSelector((state: RootState) => state.grid.expandedSection);
  const gridDimensions = useSelector((state: RootState) => state.grid.gridDimensions);

  const actions: ExploreGridActions = useMemo(() => ({
    setGridDimensions: (dims) => dispatch(setGridDimensions(dims)),
    setExpandedSection: (section) => dispatch(setExpandedSection(section)),
    setExpandedOpen: (isOpen) => dispatch(setExpandedOpen(isOpen)),
    updateExpandedHeight: (height) => dispatch(updateExpandedHeight(height)),
    updateExpandedY: (y) => dispatch(updateExpandedY(y)),
    setScrollPosition: (position) => dispatch(setScrollPosition(position)),
    setIsScrolling: (isScrolling) => dispatch(setIsScrolling(isScrolling)),
  }), [dispatch]);

  return (
    <ExploreGridPresenter
      items={items}
      expandedSection={expandedSection}
      gridDimensions={gridDimensions}
      actions={actions}
      externalLoading={externalLoading}
      sentinelRef={sentinelRef}
    />
  );
};

export default memo(ExploreGridStateConnector);
