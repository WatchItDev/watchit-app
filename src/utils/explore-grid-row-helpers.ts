import type { GridItem as GridItemType } from '@src/sections/explore/types';
import type { SliderRow } from '@src/sections/explore/components/grid/row-types';

export const MIN_GAP_BETWEEN_SLIDERS = 3;
export const SLIDER_SIZE = 2;

export const hashString = (value: string) =>
  Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 0);

export const sliderSpacingFromId = (id: string, baseSpacing: number, isMobile: boolean) =>
  isMobile ? baseSpacing : baseSpacing + (Math.abs(hashString(id)) % 3);

export const pickSliderColStart = (
  id: string,
  cols: number,
  lastStart: number | null,
  isMobile: boolean,
) => {
  if (cols <= SLIDER_SIZE || isMobile) return 0;
  const min = 1;
  const max = Math.max(min, cols - SLIDER_SIZE);
  let selected = min + (Math.abs(hashString(id)) % (max - min + 1));
  if (lastStart != null && selected === lastStart && max > min) {
    selected = min + ((selected - min + 1) % (max - min + 1));
  }
  return selected;
};

export const takeFromQueue = <T>(queue: T[]) => queue.shift() ?? null;

export const buildSliderGrid = (
  slider: GridItemType,
  columns: number,
  isMobile: boolean,
  lastSliderColStart: { current: number | null },
) => {
  const cols = Math.max(SLIDER_SIZE, columns);
  const grid: SliderRow['grid'] = [
    Array.from({ length: cols }),
    Array.from({ length: cols }),
  ];
  const sliderColStart = pickSliderColStart(slider.id, cols, lastSliderColStart.current, isMobile);
  lastSliderColStart.current = sliderColStart;

  for (let row = 0; row < SLIDER_SIZE; row += 1) {
    for (let col = 0; col < SLIDER_SIZE; col += 1) {
      grid[row][sliderColStart + col] = 'slider';
    }
  }

  return { grid, sliderColStart, cols };
};
