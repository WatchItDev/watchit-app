import { describe, expect, it, vi } from 'vitest';
import type { Post } from '@src/graphql/generated/graphql';
import { repeatUntil, postsToGridItems } from '../../explore-grid.utils';
import { createMockExplorePost } from '../../../__tests__/fixtures';

vi.mock('@src/utils/post-normalizer', () => ({
  normalizePost: (post: any) => ({ ...post, normalized: true }),
}));

vi.mock('@web3auth/auth', () => ({}));

describe('repeatUntil', () => {
  it('reuses items until the minimum length is reached', () => {
    expect(repeatUntil([1, 2], 5)).toEqual([1, 2, 1, 2, 1]);
  });

  it('returns a shallow copy when the array already satisfies the minimum', () => {
    const input = [1, 2, 3];
    const output = repeatUntil(input, 2);
    expect(output).toEqual([1, 2]);
    expect(output).not.toBe(input);
  });

  it('gracefully handles empty arrays', () => {
    expect(repeatUntil([], 10)).toEqual([]);
  });
});

describe('postsToGridItems', () => {
  const postA = createMockExplorePost({ id: 1, title: 'Alpha' }) as unknown as Post;
  const postB = createMockExplorePost({ id: 2, title: 'Beta' }) as unknown as Post;

  it('converts posts into grid items injecting scheduled sliders', () => {
    const items = postsToGridItems([postA, postB], 5);

    const regulars = items.filter((item) => item.type === 'regular');
    const sliders = items.filter((item) => item.type === 'slider');

    expect(regulars).toHaveLength(5);
    expect(sliders.length).toBeGreaterThanOrEqual(1);
    expect(sliders[0]).toMatchObject({ id: 'slider-top-picks', data: { sliderId: 'top-picks' } });
    expect(new Set(regulars.map((item) => item.id)).size).toBe(5);
  });

  it('keeps slider schedule even when posts array is shorter than minimum', () => {
    const items = postsToGridItems([postA], 2);
    const slider = items.find((item) => item.id === 'slider-top-picks');
    expect(slider).toBeDefined();
  });
});
