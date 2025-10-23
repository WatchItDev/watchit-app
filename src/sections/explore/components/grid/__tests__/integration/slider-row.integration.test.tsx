import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SliderRow } from '../../slider-row';
import type { AnyRow } from '../../row-types';
import type { GridItem } from '@src/sections/explore/types';
import { createMockGridItem, createMockExplorePost } from '../../../../__tests__/fixtures';

const hoisted = vi.hoisted(() => {
  let latestSliderProps: any = null;
  const renderSliderByIdMock = vi.fn((_id: string | undefined, props: any) => {
    latestSliderProps = props;
    return (
      <button
        type="button"
        data-testid="mock-slider"
        onClick={() => props.onPostSelect?.({ id: 999, title: 'From slider' } as any)}
      >
        slider
      </button>
    );
  });
  return { latestSliderProps: () => latestSliderProps, renderSliderByIdMock };
});

vi.mock('@src/sections/explore/components/grid-item-card', () => ({
  __esModule: true,
  default: ({ post, onActivate }: any) => (
    <button type="button" data-testid="grid-item-card" onClick={() => onActivate?.(post)}>
      {post?.title}
    </button>
  ),
}));

vi.mock('../../slider-registry', () => ({
  renderSliderById: hoisted.renderSliderByIdMock,
}));

beforeEach(() => {
  hoisted.renderSliderByIdMock.mockClear();
});

const buildSliderRow = (slider: GridItem, extras: GridItem[]): AnyRow => ({
  key: 'slider-row',
  type: 'slider',
  slider,
  sliderColStart: 0,
  grid: [
    ['slider', extras[0], null],
    ['slider', null, extras[1] ?? null],
  ] as any,
});

describe('SliderRow', () => {
  it('renders the slider block and routes interactions through callbacks', () => {
    const post = createMockExplorePost();
    const sliderItem = createMockGridItem({
      id: 'slider-top-picks',
      type: 'slider',
      data: { sliderId: 'top-picks' },
      dimensions: { width: 2, height: 2 },
    });
    const otherItems = [
      createMockGridItem({ id: 'item-A', data: { post } }),
      createMockGridItem({ id: 'item-B', data: { post: { ...post, title: 'B' } } }),
    ];

    const onGridItemClick = vi.fn();
    const onSliderPostSelect = vi.fn();
    render(
      <SliderRow
        row={buildSliderRow(sliderItem, otherItems)}
        columns={3}
        gap={12}
        itemSize={140}
        expandedSection={null}
        onGridItemClick={onGridItemClick}
        onSliderPostSelect={onSliderPostSelect}
      />,
    );

    const sliderButton = screen.getByTestId('mock-slider');
    expect(sliderButton).toBeInTheDocument();
    expect(hoisted.renderSliderByIdMock).toHaveBeenCalledWith('top-picks', expect.any(Object));
    sliderButton.click();
    expect(onSliderPostSelect).toHaveBeenCalledWith(sliderItem, { id: 999, title: 'From slider' });
    expect(hoisted.latestSliderProps()?.span).toEqual({ w: 2, h: 2 });

    const [firstItemButton] = screen.getAllByTestId('grid-item-card');
    firstItemButton.click();
    expect(onGridItemClick).toHaveBeenCalledWith(otherItems[0]);
  });
});
