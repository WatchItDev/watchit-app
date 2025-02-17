import { useState, useEffect, useRef } from 'react';
import { calculateItemsPerSlide } from '@src/components/carousel/variants/utils';

interface UseItemsPerSlideProps {
  minItemWidth: number;
  maxItemWidth: number;
}

export function useItemsPerSlide({ minItemWidth, maxItemWidth }: UseItemsPerSlideProps) {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
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
