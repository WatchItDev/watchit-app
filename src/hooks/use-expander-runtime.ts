import { useMemo, useRef } from 'react';
import type { ExpandedSection as ExpandedSectionType } from '@src/sections/explore/types';

/**
 * Centralises the mutable references shared across the expander orchestration hooks.
 */
export const useExpanderRuntime = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedSectionRef = useRef<ExpandedSectionType | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);
  const scrollDelayRef = useRef<number | null>(null);
  const expanderRowRef = useRef<HTMLDivElement | null>(null);
  const expanderObserverRef = useRef<ResizeObserver | null>(null);
  const latestExpanderHeightRef = useRef(0);
  const lastMeasuredRef = useRef(0);
  const heightUpdateTimeoutRef = useRef<number | null>(null);
  const pendingCenterRef = useRef(false);

  return useMemo(
    () => ({
      scrollRef,
      expandedSectionRef,
      cleanupTimeoutRef,
      scrollDelayRef,
      expanderRowRef,
      expanderObserverRef,
      latestExpanderHeightRef,
      lastMeasuredRef,
      heightUpdateTimeoutRef,
      pendingCenterRef,
    }),
    [],
  );
};
