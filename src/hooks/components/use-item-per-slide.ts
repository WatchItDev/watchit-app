import { useState, useEffect, useRef } from 'react';
import { calculateItemsPerSlide } from '@src/utils/components/carousel';
import { UseItemsPerSlideProps, UseItemsPerSlideReturn } from './types';

/**
 * Hook that calculates the optimal number of items per slide based on the width of the parent container
 * and the constraints of minimum and maximum item widths.
 *
 * How the observer works:
 * 1. The observer is created with a callback that calculates the number of items per slide based on the parent width.
 * 2. The observer is attached to the parent container.
 * 3. When the parent container resizes, the observer callback is triggered.
 * 4. The number of items per slide is recalculated based on the new parent width.
 * 5. The number of items per slide is updated in the state.
 * 6. The observer is disconnected when the component is unmounted.
 *
 * @param {Object} UseItemsPerSlideProps - The input properties to calculate the items.
 * @param {number} UseItemsPerSlideProps.minItemWidth - The minimum width allowed for a single item.
 * @param {number} UseItemsPerSlideProps.maxItemWidth - The maximum width allowed for a single item.
 * @returns {Object} An object containing the number of items per slide and a reference to the parent container.
 */

export function useItemsPerSlide({ minItemWidth, maxItemWidth }: UseItemsPerSlideProps): UseItemsPerSlideReturn {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        const items = calculateItemsPerSlide({ parentWidth, minItemWidth, maxItemWidth });
        setItemsPerSlide(items);
      }
    });

    observer.observe(parentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const items = calculateItemsPerSlide({ parentWidth, minItemWidth, maxItemWidth });
      setItemsPerSlide(items);
    }
  }, [minItemWidth, maxItemWidth]);

  return { itemsPerSlide, parentRef };
}
