import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { VirtualizedRows } from '../../virtualized-grid-rows';
import type { AnyRow } from '../../row-types';

const hoisted = vi.hoisted(() => {
  const normalRowMock = vi.fn();
  const sliderRowMock = vi.fn();
  const expanderRowMock = vi.fn();

  return { normalRowMock, sliderRowMock, expanderRowMock };
});

vi.mock('../../normal-row', () => ({
  NormalRow: (...args: any[]) => {
    hoisted.normalRowMock(...args);
    return <div data-testid="normal-row" />;
  },
}));

vi.mock('../../slider-row', () => ({
  SliderRow: (...args: any[]) => {
    hoisted.sliderRowMock(...args);
    return <div data-testid="slider-row" />;
  },
}));

vi.mock('../../expander-row', () => ({
  ExpanderRow: (...args: any[]) => {
    hoisted.expanderRowMock(...args);
    return <div data-testid="expander-row" />;
  },
}));

beforeEach(() => {
  hoisted.normalRowMock.mockClear();
  hoisted.sliderRowMock.mockClear();
  hoisted.expanderRowMock.mockClear();
});

describe('VirtualizedRows', () => {
  it('renders virtual rows delegating to specialized row components', () => {
    const rows: AnyRow[] = [
      { key: 'normal-0', type: 'normal', cells: [] },
      {
        key: 'slider-1',
        type: 'slider',
        slider: { id: 'slider', type: 'slider', color: '#000', title: 'Slider', dimensions: { width: 2, height: 2 }, position: { x: 0, y: 0 } },
        grid: [],
        sliderColStart: 0,
      } as any,
      { key: 'expander-2', type: 'expander', anchorForRowIndex: 1 },
    ];

    const virtualizer = {
      getVirtualItems: () => [
        { index: 0, key: 'normal-0', start: 0 },
        { index: 1, key: 'slider-1', start: 100 },
        { index: 2, key: 'expander-2', start: 200 },
      ],
      getTotalSize: () => 600,
    } as any;

    const setExpanderNode = vi.fn();
    const sentinelRef = { current: null };

    const { getByTestId } = render(
      <VirtualizedRows
        rows={rows}
        virtualizer={virtualizer}
        columns={4}
        itemSize={160}
        gap={16}
        expandedSection={null}
        hasUserScrolledAfterExpand={false}
        items={[]}
        setExpanderNode={setExpanderNode}
        onGridItemClick={vi.fn()}
        onSliderPostSelect={vi.fn()}
        onCloseExpanded={vi.fn()}
        animationDuration={300}
        sentinelRef={sentinelRef as any}
      />,
    );

    expect(hoisted.normalRowMock).toHaveBeenCalledWith(
      expect.objectContaining({ row: rows[0], columns: 4, itemSize: 160 }),
      expect.anything(),
    );
    expect(hoisted.sliderRowMock).toHaveBeenCalled();
    expect(hoisted.expanderRowMock).toHaveBeenCalled();
    const expanderNodeCall = setExpanderNode.mock.calls.find(([node]) => node);
    expect(expanderNodeCall?.[0]).toBeInstanceOf(HTMLElement);
    expect(getByTestId('virtualized-rows-sentinel')).toBeInTheDocument();
  });
});
