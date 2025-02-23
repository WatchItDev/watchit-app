import { it, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import {LeftIcon, RightIcon} from '@src/components/carousel/components/CarouselArrowIcons';

describe('[COMPONENTS]: LeftIcon component', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    expect(baseElement).toMatchSnapshot();
  })

  it('renders correctly with isRTL false', () => {
    const {getByTestId} = render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    const iconElement = getByTestId('leftButton');
    // When isRTL is false, the default transform should be applied.
    expect(iconElement.getAttribute('data-sx')).toContain('"transform":" scaleX(-1)"');
    // and the icon prop is passed correctly.
    expect(iconElement.getAttribute('data-icon')).toBe('eva:arrow-ios-forward-fill');
  });

  it('renders correctly with isRTL true', () => {
    expect(render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={true} />).getByTestId(/leftButton/i).getAttribute('data-sx')).toContain('"transform":" scaleX(1)"');
  });
});

describe('RightIcon component', () => {
  it('to match snapshot', () => {
    expect(render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />).baseElement).toMatchSnapshot();
  })

  it('renders correctly with isRTL false', () => {
    const {getByTestId} = render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    const iconElement = getByTestId('rightButton');
    // When isRTL is false, no transform should be applied.
    // The sx prop should be an empty object.
    expect(iconElement.getAttribute('data-sx')).toBe('{}');
    expect(iconElement.getAttribute('data-icon')).toBe('eva:arrow-ios-forward-fill');
  });

  it('renders correctly with isRTL true', () => {
    expect(render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={true} />).getByTestId(/rightButton/i).getAttribute('data-sx')).toContain('"transform":" scaleX(-1)"');
  });
});
