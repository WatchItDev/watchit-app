import Box from '@mui/material/Box';
import type { Post } from '@src/graphql/generated/graphql';
import ExpanderPlayerInfo from '@src/sections/explore/components/explore-expander-info';
import ExpandedSection from './expanded-section';
import type { AnyRow } from './row-types';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '../../types';

interface ExpanderRowProps {
  row: AnyRow;
  expandedSection: ExpandedSectionType | null;
  items: GridItemType[];
  gap: number;
  onCloseExpanded: () => void;
  animationDuration: number;
}

/** Hosts the inline player expander inside the virtualized grid. */
export const ExpanderRow = ({
  row,
  expandedSection,
  items,
  gap,
  onCloseExpanded,
  animationDuration,
}: ExpanderRowProps) => {
  if (row.type !== 'expander' || !expandedSection) return null;
  const expandedItem = items.find((item) => item.id === expandedSection.itemId);
  if (!expandedItem) return null;
  const fallbackPost = expandedItem.data?.post as Post | undefined;
  const resolvedPost = expandedSection.selectedPost ?? fallbackPost ?? null;
  if (!resolvedPost) return null;

  return (
    <Box sx={{ width: '100%' }}>
      <ExpandedSection
        expandedSection={expandedSection}
        item={expandedItem}
        onRequestClose={onCloseExpanded}
        animationDuration={animationDuration}
        gap={gap}
      >
        <ExpanderPlayerInfo
          key={`expander-${expandedSection.itemId}-${resolvedPost.id}`}
          post={resolvedPost}
        />
      </ExpandedSection>
    </Box>
  );
};
