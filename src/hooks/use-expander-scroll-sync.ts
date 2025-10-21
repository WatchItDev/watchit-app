import { useEffect } from 'react';
import { setHasUserScrolledAfterExpand } from '@redux/grid';
import type { ExpandedSection as ExpandedSectionType } from '@src/sections/explore/types';
import type { AppDispatch } from '@src/redux/store';
import type { Virtualizer } from '@tanstack/react-virtual';
import type { AnyRow } from '@src/sections/explore/components/grid/row-types';

interface RuntimeRefs {
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollDelayRef: React.MutableRefObject<number | null>;
  pendingCenterRef: React.MutableRefObject<boolean>;
}

interface UseExpanderScrollSyncArgs {
  expandedSection: ExpandedSectionType | null;
  hasUserScrolledAfterExpand: boolean;
  dispatch: AppDispatch;
  runtime: RuntimeRefs;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  rows: AnyRow[];
}

/**
 * Keeps the scroll position aligned with the expander lifecycle.
 */
export const useExpanderScrollSync = ({
  expandedSection,
  hasUserScrolledAfterExpand,
  dispatch,
  runtime,
  virtualizer,
  rows,
}: UseExpanderScrollSyncArgs) => {
  const dimAll = !!expandedSection && !hasUserScrolledAfterExpand;

  useEffect(() => {
    const node = runtime.scrollRef.current;
    if (!node) return;
    let flagged = false;
    const onScroll = () => {
      if (dimAll && !flagged) {
        flagged = true;
        dispatch(setHasUserScrolledAfterExpand(true));
      }
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, [dimAll, dispatch, runtime.scrollRef]);

  useEffect(() => {
    if (!expandedSection || !expandedSection.isOpen) {
      runtime.pendingCenterRef.current = false;
      if (runtime.scrollDelayRef.current) {
        window.clearTimeout(runtime.scrollDelayRef.current);
        runtime.scrollDelayRef.current = null;
      }
      return;
    }

    if (!runtime.pendingCenterRef.current) return;

    if (runtime.scrollDelayRef.current) {
      window.clearTimeout(runtime.scrollDelayRef.current);
      runtime.scrollDelayRef.current = null;
    }

    const centerExpander = () => {
      const scrollElement = runtime.scrollRef.current;
      if (!scrollElement) {
        runtime.scrollDelayRef.current = null;
        return;
      }
      const targetKey = `x-${expandedSection.itemId}`;
      const expanderRowIndex = rows.findIndex((row) => row.type === 'expander' && row.key === targetKey);
      if (expanderRowIndex < 0) {
        return;
      }

      const target = virtualizer.getVirtualItems().find((item) => item.key === targetKey);

      if (!target || expandedSection.height <= 0) {
        virtualizer.scrollToIndex(expanderRowIndex, { align: 'center' });
        runtime.scrollDelayRef.current = window.setTimeout(centerExpander, 32);
        return;
      }

      const viewportHeight = scrollElement.clientHeight;
      const desired = target.start - Math.max((viewportHeight - expandedSection.height) / 2, 0);
      const offset = Math.max(0, desired);
      runtime.pendingCenterRef.current = false;
      runtime.scrollDelayRef.current = null;
      virtualizer.scrollToOffset(offset, { behavior: 'smooth' });
    };

    centerExpander();
  }, [expandedSection?.isOpen, expandedSection?.height, expandedSection?.itemId, runtime.scrollRef, runtime.pendingCenterRef, virtualizer, rows]);
};
