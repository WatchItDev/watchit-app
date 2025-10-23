import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import ExploreGrid from '../../explore-grid';
import { createMockExplorePost } from '../../../__tests__/fixtures';
import { resetGrid, setItems } from '@redux/grid';

const dispatchMock = vi.fn();
const sentinelRef = { current: document.createElement('div') };
const posts = [
  createMockExplorePost({ id: 1, title: 'Alpha' }),
  createMockExplorePost({ id: 2, title: 'Beta' }),
];

const virtualizedGridSpy = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
}));

vi.mock('@src/hooks/use-infinite-feed', () => ({
  useInfiniteFeed: () => ({ items: posts, sentinelRef }),
}));

vi.mock('../../grid/virtualized-grid', () => ({
  __esModule: true,
  default: (props: any) => {
    virtualizedGridSpy(props);
    return <div data-testid="virtualized-grid" />;
  },
}));

describe('ExploreGrid E2E', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    virtualizedGridSpy.mockClear();
  });

  it('resets the grid and dispatches normalized items into the store', async () => {
    render(<ExploreGrid />);

    expect(dispatchMock).toHaveBeenCalledWith(resetGrid());

    await waitFor(() => {
      const dispatched = dispatchMock.mock.calls.find(
        ([action]) => action.type === setItems([] as any).type,
      );
      expect(dispatched).toBeDefined();
      const [{ payload }] = dispatched!;
      expect(Array.isArray(payload)).toBe(true);
      expect(payload[0]).toMatchObject({ type: 'regular', title: 'Alpha' });
    });

    expect(virtualizedGridSpy).toHaveBeenCalledWith(
      expect.objectContaining({ sentinelRef }),
    );
  });
});
