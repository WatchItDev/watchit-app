import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderSliderById } from '../../../grid/slider-registry';

const hoisted = vi.hoisted(() => {
  const sliderSpies: Record<string, ReturnType<typeof vi.fn>> = {};
  const register = (name: string) => {
    const spy = vi.fn((props: any) => ({ [`mock-${name}`]: props }));
    sliderSpies[name] = spy;
    return spy;
  };

  return { sliderSpies, register };
});

vi.mock('@src/components/adaptative-slider/variants/top-picks', () => ({
  default: hoisted.register('top-picks'),
}));
vi.mock('@src/components/adaptative-slider/variants/continue-watching', () => ({
  default: hoisted.register('continue-watching'),
}));
vi.mock('@src/components/adaptative-slider/variants/popular-this-week', () => ({
  default: hoisted.register('popular-week'),
}));
vi.mock('@src/components/adaptative-slider/variants/more-from', () => ({
  default: hoisted.register('comedy'),
}));
vi.mock('@src/components/adaptative-slider/variants/popular-in-region', () => ({
  default: hoisted.register('region'),
}));
vi.mock('@src/components/adaptative-slider/variants/interest', () => ({
  default: hoisted.register('interest'),
}));

afterEach(() => {
  Object.values(hoisted.sliderSpies).forEach((spy) => spy.mockClear());
});

describe('renderSliderById', () => {
  it('returns null when there is no slider registered', () => {
    expect(renderSliderById('unknown', { span: { w: 2, h: 2 }, cell: 120, gapPx: 12 })).toBeNull();
  });

  it('delegates rendering to the registered slider component', () => {
    const props = { span: { w: 2, h: 2 }, cell: 120, gapPx: 12, onPostSelect: vi.fn() };
    const element = renderSliderById('top-picks', props);

    expect(element).toBeTruthy();
    expect(element).toMatchObject({ props });
    expect(element?.type).toBe(hoisted.sliderSpies['top-picks']);
  });
});
