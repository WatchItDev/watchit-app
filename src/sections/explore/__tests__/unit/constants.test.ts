import { describe, expect, it } from 'vitest';
import { GRID_CONFIG, REACTIONS, formatNumber } from '../../CONSTANTS';

describe('formatNumber', () => {
  it('returns 0 when value is empty', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });

  it('keeps small numbers untouched', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('formats thousands and millions using compact notation', () => {
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(2_400_000)).toBe('2.4M');
  });
});

describe('REACTIONS metadata', () => {
  it('exposes reactions ordered from lowest to highest impact', () => {
    const order = REACTIONS.map((reaction) => reaction.value);
    expect(order).toEqual(['hate', 'love', 'super_like', 'mega_fan']);
  });

  it('keeps prices only for paid reactions', () => {
    const priced = REACTIONS.filter((reaction) => reaction.price);
    expect(priced.map((reaction) => reaction.value)).toEqual(['super_like', 'mega_fan']);
  });
});

describe('GRID_CONFIG defaults', () => {
  it('ensures virtualized grid animation duration matches design expectations', () => {
    expect(GRID_CONFIG.animationDuration).toBeGreaterThanOrEqual(300);
    expect(GRID_CONFIG.gap).toBe(12);
  });
});
