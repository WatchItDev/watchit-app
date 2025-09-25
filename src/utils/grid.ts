import { GridItem, GridDimensions, GridConfig } from '@src/sections/explore/types';

// ---------------------------------------------
// Utilidades
// ---------------------------------------------
export const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const hashInRange = (s: string, min: number, max: number): number => {
  if (max < min) [min, max] = [max, min];
  const span = max - min + 1;
  return min + (hashString(s) % span);
};

// ---------------------------------------------
// Dimensiones del grid
// ---------------------------------------------
export const calculateGridDimensions = (
  containerWidth: number,
  config?: GridConfig
): GridDimensions => {
  const finalConfig = config ?? {
    minItemSize: 240,              // x2
    maxItemSize: 420,              // x2
    gap: 16,
    breakpoints: { mobile: 768, tablet: 1024, desktop: 1200 },
    itemsPerPage: 20,
    animationDuration: 300,
    opacityWhenExpanded: 0.3,
  };

  const { minItemSize, maxItemSize, gap, breakpoints } = finalConfig;

  const W = Math.max(0, containerWidth);
  if (W === 0) {
    return { containerWidth: 0, itemSize: 0, gap, columns: 0, rows: 0 };
  }

  const minColsForMax = Math.max(1, Math.ceil((W - gap) / (maxItemSize + gap)));
  const maxColsForMin = Math.max(minColsForMax, Math.floor((W - gap) / (minItemSize + gap)));

  // 👉 menos columnas preferidas (ítems más grandes)
  let prefMin = 1, prefMax = 2;
  if (W <= breakpoints.mobile) { prefMin = 1; prefMax = 2; }
  else if (W <= breakpoints.tablet) { prefMin = 2; prefMax = 3; }
  else { prefMin = 3; prefMax = 5; }

  const interMin = Math.max(minColsForMax, prefMin);
  const interMax = Math.min(maxColsForMin, prefMax);

  const columns = interMin <= interMax ? interMax : Math.max(minColsForMax, prefMin);
  const itemSize = (W - gap * (columns + 1)) / columns;

  return { containerWidth: W, itemSize, gap, columns, rows: 0 };
};

// ---------------------------------------------
// Helpers de posición
// ---------------------------------------------
export const getTopOfRow = (row: number, grid: GridDimensions): number => {
  const { itemSize, gap } = grid;
  return gap + row * (itemSize + gap);
};

export const calculateItemPosition = (
  item: GridItem,
  grid: GridDimensions,
  _rowHeights: number[]
): { x: number; y: number } => {
  const { itemSize, gap } = grid;
  const x = gap + item.position.x * (itemSize + gap);
  const y = gap + item.position.y * (itemSize + gap);
  return { x, y };
};

// ---------------------------------------------
// Alturas de fila (uniformes = itemSize)
// ---------------------------------------------
export const calculateRowHeights = (
  items: GridItem[],
  grid: GridDimensions
): number[] => {
  const lastRowExclusive = items.reduce(
    (max, it) => Math.max(max, it.position.y + it.dimensions.height),
    0
  );
  if (lastRowExclusive <= 0) return [];
  return Array.from({ length: lastRowExclusive }, () => grid.itemSize);
};

// ---------------------------------------------
// Helpers internos para ocupación
// ---------------------------------------------
type Pos = { x: number; y: number };

const fitsAt = (
  x: number,
  y: number,
  w: number,
  h: number,
  cols: number,
  occ: boolean[][]
) => {
  if (x + w > cols) return false;
  for (let yy = y; yy < y + h; yy++) {
    if (!occ[yy]) occ[yy] = [];
    for (let xx = x; xx < x + w; xx++) {
      if (occ[yy][xx]) return false;
    }
  }
  return true;
};

const occupy = (x: number, y: number, w: number, h: number, occ: boolean[][]) => {
  for (let yy = y; yy < y + h; yy++) {
    if (!occ[yy]) occ[yy] = [];
    for (let xx = x; xx < x + w; xx++) occ[yy][xx] = true;
  }
};

const xSequenceWithBias = (preferredX: number, cols: number, w: number): number[] => {
  const maxStart = cols - w;
  const seq: number[] = [];
  const start = Math.max(0, Math.min(preferredX, maxStart));
  for (let x = start; x <= maxStart; x++) seq.push(x);
  for (let x = 0; x < start; x++) seq.push(x);
  return seq;
};

const findSpotBiased = (
  it: GridItem,
  cols: number,
  occ: boolean[][],
  startRow: number,
  preferredX: number
): Pos => {
  const w = it.dimensions.width;
  const h = it.dimensions.height;
  let y = Math.max(0, startRow);
  const xs = xSequenceWithBias(preferredX, cols, w);

  while (true) {
    for (const x of xs) {
      if (fitsAt(x, y, w, h, cols, occ)) return { x, y };
    }
    y += 1;
  }
};

// ---------------------------------------------
// Adaptación responsive
// ---------------------------------------------
export const adaptItemsToColumns = (items: GridItem[], grid: GridDimensions): GridItem[] => {
  const cols = grid.columns;
  return items.map((it) => {
    if (it.type === 'regular') return { ...it, dimensions: { width: 1, height: 1 } };
    const w = Math.min(2, Math.max(1, cols));
    const h = 2;
    return { ...it, dimensions: { width: w, height: h } };
  });
};

// ---------------------------------------------
// Layout armónico
// ---------------------------------------------
export const generateHarmoniousLayout = (
  items: GridItem[],
  grid: GridDimensions,
  opts?: {
    prevPositions?: Map<string, Pos>;
    minSliderRowGap?: number;
    maxSliderRowGap?: number;
  }
): { items: GridItem[]; totalRows: number } => {
  const minGap = Math.max(1, opts?.minSliderRowGap ?? 2);
  const maxGap = Math.max(minGap, opts?.maxSliderRowGap ?? minGap);
  const prev = opts?.prevPositions ?? new Map<string, Pos>();
  const cols = grid.columns;

  const allSliders = items.filter(i => i.type === 'slider');
  const allRegulars = items.filter(i => i.type !== 'slider');

  const occ: boolean[][] = [];
  const placed = new Map<string, Pos>();
  let lastSliderStartRow = -Infinity;

  const alreadyPlacedIds = new Set<string>();
  for (const it of items) {
    const p = prev.get(it.id);
    if (!p) continue;
    if (fitsAt(p.x, p.y, it.dimensions.width, it.dimensions.height, cols, occ)) {
      occupy(p.x, p.y, it.dimensions.width, it.dimensions.height, occ);
      placed.set(it.id, { ...p });
      alreadyPlacedIds.add(it.id);
      if (it.type === 'slider') lastSliderStartRow = Math.max(lastSliderStartRow, p.y);
    }
  }

  const sliders = allSliders.filter(i => !alreadyPlacedIds.has(i.id));
  const regulars = allRegulars.filter(i => !alreadyPlacedIds.has(i.id));

  const placeRegular = (r: GridItem) => {
    const prefX = hashInRange(r.id, 0, Math.max(0, cols - r.dimensions.width));
    const pos = findSpotBiased(r, cols, occ, 0, prefX);
    occupy(pos.x, pos.y, r.dimensions.width, r.dimensions.height, occ);
    placed.set(r.id, pos);
  };

  const placeSlider = (s: GridItem) => {
    const gapRows = hashInRange(s.id, minGap, maxGap);
    const startRow = Math.max(0, lastSliderStartRow + gapRows);
    const prefX = hashInRange(s.id + ':x', 0, Math.max(0, cols - s.dimensions.width));
    const pos = findSpotBiased(s, cols, occ, startRow, prefX);
    occupy(pos.x, pos.y, s.dimensions.width, s.dimensions.height, occ);
    placed.set(s.id, pos);
    lastSliderStartRow = pos.y;
  };

  const rowsBetweenAvg = Math.round((minGap + maxGap) / 2);
  const regularsPerBatch = Math.max(cols * Math.max(1, rowsBetweenAvg - 1), cols);

  while (sliders.length || regulars.length) {
    let placedRegsThisBatch = 0;
    while (placedRegsThisBatch < regularsPerBatch && regulars.length) {
      placeRegular(regulars.shift()!);
      placedRegsThisBatch++;
    }
    if (sliders.length) placeSlider(sliders.shift()!);
  }

  const positioned: GridItem[] = items.map(it => {
    const p = placed.get(it.id);
    return { ...it, position: p ?? { x: 0, y: 0 } };
  });

  const totalRows = positioned.reduce(
    (max, it) => Math.max(max, it.position.y + it.dimensions.height),
    0
  );

  return { items: positioned, totalRows };
};

// ---------------------------------------------
// Ancla “frontera de fila” para expandido
// ---------------------------------------------
const findNearestClearAnchorRow = (allItems: GridItem[], targetRow: number): number => {
  for (let r = targetRow; r > 0; r--) {
    const someCross = allItems.some(it => it.position.y < r && (it.position.y + it.dimensions.height) > r);
    if (!someCross) return r;
  }
  return 0;
};

export const calculateExpandedSectionPosition = (
  item: GridItem,
  allItems: GridItem[],
  grid: GridDimensions
): { anchorRow: number; y: number } => {
  const targetRow = item.position.y;
  const anchorRow = findNearestClearAnchorRow(allItems, targetRow);
  const y = getTopOfRow(anchorRow, grid);
  return { anchorRow, y };
};
