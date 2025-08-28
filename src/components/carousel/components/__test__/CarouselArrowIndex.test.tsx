import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CarouselArrowIndex } from '@src/components/carousel';

describe('[COMPONENTS]: CarouselArrowIndex component testing', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(
      <CarouselArrowIndex
        index={1}
        total={3}
        onNext={() => {}}
        onPrev={() => {}}
        icon="fas fa-arrow-right"
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
});
