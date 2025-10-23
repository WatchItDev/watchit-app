import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NormalRow } from '../../normal-row';
import type { AnyRow } from '../../row-types';
import type { GridItem } from '@src/sections/explore/types';
import { createMockGridItem, createMockExplorePost } from '../../../../__tests__/fixtures';

vi.mock('@src/sections/explore/components/grid-item-card', () => ({
  __esModule: true,
  default: ({ post, onActivate, isActive }: any) => (
    <button
      type="button"
      data-testid="grid-item-card"
      data-active={String(isActive)}
      onClick={() => onActivate?.(post)}
    >
      {post?.title}
    </button>
  ),
}));

const buildRow = (cells: GridItem[]): AnyRow => ({
  key: 'row-1',
  type: 'normal',
  cells,
});

describe('NormalRow', () => {
  it('renders grid items and fills remaining columns with placeholders', () => {
    const post = createMockExplorePost();
    const items: GridItem[] = [
      createMockGridItem({ id: 'item-1', data: { post } }),
      createMockGridItem({ id: 'item-2', data: { post: { ...post, title: 'Second' } } }),
    ];
    const onGridItemClick = vi.fn();

    const { container } = render(
      <NormalRow
        row={buildRow(items)}
        columns={3}
        gap={8}
        itemSize={140}
        expandedSection={null}
        onGridItemClick={onGridItemClick}
      />,
    );

    const cards = screen.getAllByTestId('grid-item-card');
    expect(cards).toHaveLength(2);
    cards[0].click();
    expect(onGridItemClick).toHaveBeenCalledWith(items[0]);

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.children.length).toBe(3);
  });

  it('returns null when the provided row is not of type normal', () => {
    const rendered = NormalRow({
      row: { key: 'expander', type: 'expander', anchorForRowIndex: 1 } as AnyRow,
      columns: 3,
      gap: 12,
      itemSize: 140,
      expandedSection: null,
      onGridItemClick: vi.fn(),
    });
    expect(rendered).toBeNull();
  });
});
