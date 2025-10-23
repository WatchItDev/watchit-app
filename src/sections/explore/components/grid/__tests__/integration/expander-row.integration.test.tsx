import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpanderRow } from '../../expander-row';
import type { AnyRow } from '../../row-types';
import type { ExpandedSection, GridItem } from '@src/sections/explore/types';
import { createMockExplorePost, createMockGridItem } from '../../../../__tests__/fixtures';

vi.mock('../../expanded-section', () => ({
  __esModule: true,
  default: ({ children, onRequestClose, item }: any) => (
    <div data-testid="expanded-section" data-item-id={item?.id}>
      <button type="button" data-testid="close-button" onClick={onRequestClose}>
        Close
      </button>
      {children}
    </div>
  ),
}));

vi.mock('../../../explore-expander-info', () => ({
  __esModule: true,
  default: ({ post }: any) => <div data-testid="expander-player-info">{post?.title}</div>,
}));

const buildRow = (anchorRow = 2): AnyRow => ({
  key: 'expander-row',
  type: 'expander',
  anchorForRowIndex: anchorRow,
});

describe('ExpanderRow', () => {
  it('renders the expanded section when the matching grid item is available', () => {
    const post = createMockExplorePost();
    const items: GridItem[] = [
      createMockGridItem({ id: 'item-1', data: { post } }),
      createMockGridItem({ id: 'item-2' }),
    ];
    const expandedSection: ExpandedSection = {
      itemId: 'item-1',
      isOpen: true,
      anchorRow: 3,
      y: 120,
      height: 400,
      selectedPost: { ...post, title: 'Selected' },
    };

    const onClose = vi.fn();
    render(
      <ExpanderRow
        row={buildRow()}
        expandedSection={expandedSection}
        items={items}
        gap={12}
        onCloseExpanded={onClose}
        animationDuration={300}
      />,
    );

    expect(screen.getByTestId('expanded-section')).toBeInTheDocument();
    expect(screen.getByTestId('expander-player-info')).toHaveTextContent('Selected');
    screen.getByTestId('close-button').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('returns null when there is no matching expanded item', () => {
    const result = ExpanderRow({
      row: buildRow(),
      expandedSection: {
        itemId: 'missing',
        isOpen: true,
        anchorRow: 0,
        y: 0,
        height: 0,
      },
      items: [],
      gap: 12,
      onCloseExpanded: vi.fn(),
      animationDuration: 300,
    });
    expect(result).toBeNull();
  });
});
