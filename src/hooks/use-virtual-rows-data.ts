import { useMemo } from 'react';
import { composeVirtualRows } from '@src/utils/explore-grid-rows';
import { injectExpanderRow } from '@src/utils/explore-grid-expander';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '@src/sections/explore/types';

/**
 * Generates the virtual rows representation required by the explore grid layout.
 */
export const useVirtualRowsData = (
  items: GridItemType[],
  columns: number,
  expandedSection: ExpandedSectionType | null,
) => {
    const { rows: baseRows, itemRowIndex } = useMemo(
      () => composeVirtualRows(items, columns, columns <= 2),
      [items, columns],
    );

    const rows = useMemo(
      () => injectExpanderRow(baseRows, expandedSection, itemRowIndex),
      [baseRows, expandedSection, itemRowIndex],
    );

    return { rows, itemRowIndex };
};
