import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export function useGridSizing({ itemMin, itemMax, gapPx = 12 }: { itemMin: number; itemMax: number; gapPx?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [itemsPerRow, setItemsPerRow] = useState(1);
  const [itemSize, setItemSize] = useState(itemMin);

  const compute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const W = el.clientWidth;

    // Si todas las celdas fuesen de itemMin, ¿cuántas entrarían?
    const maxItemsByMin = Math.max(1, Math.floor((W + gapPx) / (itemMin + gapPx)));
    // Si todas las celdas fuesen de itemMax, ¿cuántas como mínimo necesitaríamos?
    const minItemsByMax = Math.max(1, Math.ceil((W + gapPx) / (itemMax + gapPx)));

    // Elegimos un n dentro del rango permitido, priorizando más columnas si caben.
    const items = Math.max(minItemsByMax, maxItemsByMin);

    const size = Math.max(itemMin, Math.min(itemMax, (W - gapPx * (items - 1)) / items));

    setItemsPerRow(items);
    setItemSize(size);
  }, [gapPx, itemMax, itemMin]);

  useLayoutEffect(() => { compute(); }, [compute]);

  useEffect(() => {
    const ro = new ResizeObserver(() => compute());
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [compute]);

  return { ref, itemsPerRow, itemSize } as const;
}
