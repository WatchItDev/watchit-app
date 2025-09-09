import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { useInfiniteFeed } from '../../../hooks/use-infinite-feed.tsx';
import { useGridSizing } from '../../../hooks/use-grid-sizing.tsx';
import GridItemCard from './grid-item-card';
import SliderPlaceholder from './slider-placeholder';
import type { Post } from '@src/graphql/generated/graphql';
import TopPicksSlider from '@src/components/adaptative-slider/variants/top-picks.tsx';
import ContinueWatchingSlider from '@src/components/adaptative-slider/variants/continue-watching.tsx';
import PopularThisWeekSlider from '@src/components/adaptative-slider/variants/popular-this-week.tsx';
import MoreFromComedySlider from '@src/components/adaptative-slider/variants/more-from.tsx';
import PopularInRegionSlider from '@src/components/adaptative-slider/variants/popular-in-region.tsx';
import ThisCanInterestYouSlider from '@src/components/adaptative-slider/variants/interest.tsx';

// === Tipos locales ===
type SliderSpec = {
  type: 'slider';
  id: string;
  label?: string;
  allowedSpans: Array<{ w: number; h: number }>; // en celdas 1x1
  anchor?: 'left' | 'center' | 'right' | 'auto';
  after: number; // insertar después del item con índice "after"
  render?: (size: { w: number; h: number; cell: number }) => React.ReactNode;
};
type ItemSpec = { type: 'item'; id: string; post: Post };
type GridEl = ItemSpec | SliderSpec;

const CELL_MIN_PX = 220;
const CELL_MAX_PX = 360;

// devuelve el mayor span que quepa en las columnas actuales
function pickVariant(cols: number, list: Array<{ w: number; h: number }>) {
  for (const s of list) if (s.w <= cols) return s;
  const last = list[list.length - 1];
  return { w: Math.min(last.w, cols), h: last.h };
}

const gap = 12;

/** CONFIG: sliders variados y repartidos */
const SLIDERS: SliderSpec[] = [
  {
    type: 'slider',
    id: 'top-picks',
    after: 3,
    anchor: 'center',
    allowedSpans: [{ w: 8, h: 3 }, { w: 6, h: 3 }, { w: 4, h: 2 }, { w: 3, h: 2 }, { w: 2, h: 2 }],
    render: ({ w, h, cell }) => <TopPicksSlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
  {
    type: 'slider',
    id: 'continue-watching',
    after: 12,
    anchor: 'left',
    allowedSpans: [{ w: 4, h: 2 }, { w: 3, h: 2 }, { w: 2, h: 2 }, { w: 2, h: 1 }],
    render: ({ w, h, cell }) => <ContinueWatchingSlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
  {
    type: 'slider',
    id: 'popular-week',
    after: 22,
    anchor: 'right',
    allowedSpans: [{ w: 6, h: 2 }, { w: 4, h: 2 }, { w: 3, h: 2 }, { w: 2, h: 2 }],
    render: ({ w, h, cell }) => <PopularThisWeekSlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
  {
    type: 'slider',
    id: 'comedy',
    after: 35,
    anchor: 'center',
    allowedSpans: [{ w: 4, h: 4 }, { w: 4, h: 3 }, { w: 3, h: 3 }, { w: 3, h: 2 }, { w: 2, h: 2 }],
    render: ({ w, h, cell }) => <MoreFromComedySlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
  {
    type: 'slider',
    id: 'region',
    after: 48,
    anchor: 'right',
    allowedSpans: [{ w: 2, h: 6 }, { w: 2, h: 4 }, { w: 2, h: 3 }, { w: 2, h: 2 }],
    render: ({ w, h, cell }) => <PopularInRegionSlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
  {
    type: 'slider',
    id: 'interest',
    after: 60,
    anchor: 'left',
    allowedSpans: [{ w: 6, h: 2 }, { w: 4, h: 2 }, { w: 3, h: 2 }, { w: 2, h: 2 }, { w: 2, h: 1 }],
    render: ({ w, h, cell }) => <ThisCanInterestYouSlider span={{ w, h }} cell={cell} gapPx={gap} />,
  },
];
// const SLIDERS: SliderSpec[] = [
//   {
//     type: 'slider',
//     id: 'hero-mid',
//     label: 'Slider 1',
//     after: 3,                     // aparece tras el 4º item
//     anchor: 'center',
//     // opciones grandes→pequeñas (4x4, 3x3, 2x2)
//     allowedSpans: [{ w: 2, h: 2 }, { w: 2, h: 2 }, { w: 2, h: 2 }],
//   },
//   {
//     type: 'slider',
//     id: 'tall-left',
//     label: 'Slider 2',
//     after: 12,                    // cerca de la parte superior
//     anchor: 'left',
//     // alto y angosto (1x4, 1x3, 1x2)
//     allowedSpans: [{ w: 1, h: 2 }, { w: 1, h: 2 }, { w: 2, h: 1 }],
//   },
//   {
//     type: 'slider',
//     id: 'wide-right',
//     label: 'Slider 3',
//     after: 22,
//     anchor: 'right',
//     // ancho y bajito (6x2, 4x2, 3x2)
//     allowedSpans: [{ w: 2, h: 2 }, { w: 2, h: 2 }, { w: 2, h: 1 }],
//   },
//   {
//     type: 'slider',
//     id: 'tall-center',
//     label: 'Slider 4',
//     after: 35,
//     anchor: 'center',
//     // alto medio (2x6, 2x4, 2x3)
//     allowedSpans: [{ w: 3, h: 1 }, { w: 2, h: 2 }, { w: 2, h: 1 }],
//   },
//   {
//     type: 'slider',
//     id: 'square-right',
//     label: 'Slider 5',
//     after: 48,
//     anchor: 'right',
//     // cuadrados medianos
//     allowedSpans: [{ w: 3, h: 2 }, { w: 2, h: 1 }],
//   },
// ];

export default function ExploreGrid() {
  const { items, loading, hasMore, sentinelRef } = useInfiniteFeed(30);
  const theme = useTheme();
  const gap = parseFloat(String(theme.spacing(1.5))) || 12;

  // nº de celdas por fila (cols) y tamaño de celda (cell)
  const { ref, itemsPerRow: cols, itemSize: cell } = useGridSizing({
    itemMin: CELL_MIN_PX,
    itemMax: CELL_MAX_PX,
    gapPx: gap,
  });

  // mezcla: items + sliders en posiciones fijas (after)
  const elements: GridEl[] = useMemo(() => {
    const arr: GridEl[] = [];
    const sorted = [...SLIDERS].sort((a, b) => a.after - b.after);
    let si = 0;

    items.forEach((post, i) => {
      arr.push({ type: 'item', id: `post-${post.id}`, post });
      while (si < sorted.length && sorted[si].after === i) {
        arr.push(sorted[si]);
        si++;
      }
    });
    // si sobran sliders, añádelos al final
    while (si < sorted.length) {
      arr.push(sorted[si++]);
    }
    return arr;
  }, [items]);

  return (
    <Box
      ref={ref}
      sx={{
        '--cell': `${cell}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, cols)}, minmax(0, 1fr))`,
        gridAutoRows: 'var(--cell)',    // items 1x1 siempre cuadrados
        gridAutoFlow: 'dense',          // rellena huecos
        gap: `${gap}px`,
        p: 2,
      }}
    >
      {elements.map((el) => {
        if (el.type === 'item') {
          return (
            <Box key={el.id} sx={{ gridColumn: 'auto / span 1', gridRow: 'auto / span 1' }}>
              <GridItemCard post={el.post} />
            </Box>
          );
        }

        const { w, h } = pickVariant(Math.max(1, cols), el.allowedSpans);
        let start = 1;
        if (el.anchor === 'center') start = Math.max(1, Math.floor((cols - w) / 2) + 1);
        if (el.anchor === 'right')  start = Math.max(1, cols - w + 1);

        return (
          <Box
            key={el.id}
            sx={{
              gridColumn: `${start} / span ${w}`,
              gridRow: `span ${h}`,
            }}
          >
            {el.render ? el.render({ w, h, cell }) : <SliderPlaceholder label={el.label} />}
          </Box>
        );
      })}

      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <Box key={`sk-${i}`} sx={{ gridColumn: 'auto / span 1', gridRow: 'auto / span 1' }}>
            <Skeleton variant="rounded" sx={{ width: 'var(--cell)', height: 'var(--cell)', borderRadius: 2 }} />
          </Box>
        ))}

      {hasMore && <Box ref={sentinelRef} sx={{ gridColumn: '1 / -1', height: theme.spacing(4) }} />}
    </Box>
  );
}
