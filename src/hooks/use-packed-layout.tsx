import { useMemo } from 'react';
import type { GridElement, PlacedNode } from '../sections/explore/types.ts';

function pickSpan(
  el: GridElement,
  cols: number
): { w: number; h: number } {
  if (el.type === 'item') return { w: 1, h: 1 };
  const list = el.allowedSpans?.length ? el.allowedSpans : [{ w: 4, h: 2 }, { w: 2, h: 2 }];
  // Elegimos el primer tamaño quepa en cols; si ninguno, usamos el menor y lo recortamos a cols.
  for (const s of list) if (s.w <= cols) return s;
  const last = list[list.length - 1];
  return { w: Math.min(last.w, cols), h: last.h };
}

/** Simple Skyline bin-packing con desempate por cercanía al centro. */
export function usePackedLayout(elements: GridElement[], cols: number) {
  const layout = useMemo<PlacedNode[]>(() => {
    const heights = Array.from({ length: cols }, () => 0); // "altura" por columna en celdas
    const center = cols / 2;
    const nodes: PlacedNode[] = [];

    for (const el of elements) {
      const { w, h } = pickSpan(el, cols);
      let bestX = 0;
      let bestY = Number.POSITIVE_INFINITY;
      let bestDist = Number.POSITIVE_INFINITY;

      const maxStart = Math.max(0, cols - w);
      for (let x = 0; x <= maxStart; x++) {
        const y = Math.max(...heights.slice(x, x + w));
        const dist = Math.abs((x + w / 2) - center);

        // 1) menor y (fila más baja disponible)
        // 2) más centrado (menos sesgo a izquierda/derecha)
        // 3) menor x
        if (y < bestY || (y === bestY && (dist < bestDist || (dist === bestDist && x < bestX)))) {
          bestY = y;
          bestX = x;
          bestDist = dist;
        }
      }

      for (let c = bestX; c < bestX + w; c++) heights[c] = bestY + h;
      nodes.push({ el, x: bestX, y: bestY, w, h });
    }

    return nodes;
  }, [elements, cols]);

  return layout;
}
