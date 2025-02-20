import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {CarouselArrows} from "@src/components/carousel";


describe('[COMPONENTS]: CarouselArrows component testing', () => {
  it('to match snapshot', () => {
    const{baseElement} = render(<CarouselArrows onNext={() => {}} onPrev={() => {}} />);
    expect(baseElement).toMatchSnapshot();
  });
})
