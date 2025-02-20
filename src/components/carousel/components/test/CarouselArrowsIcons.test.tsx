import { it, vi, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {LeftIcon, RightIcon} from '@src/components/carousel/components/CarouselArrowIcons';

// Mock the Iconify component to capture its props.
vi.mock('@src/components/iconify', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div
        data-testid="iconify"
        data-icon={props.icon}
        data-sx={JSON.stringify(props.sx)}
      />
    ),
  };
});

describe('LeftIcon component', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    expect(baseElement).toMatchSnapshot();
  })

  it('renders correctly with isRTL false', () => {
    render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    const iconElement = screen.getByTestId('iconify');
    // When isRTL is false, the default transform should be applied.
    expect(iconElement.getAttribute('data-sx')).toContain('"transform":" scaleX(-1)"');
    // and the icon prop is passed correctly.
    expect(iconElement.getAttribute('data-icon')).toBe('eva:arrow-ios-forward-fill');
  });

  it('renders correctly with isRTL true', () => {
    render(<LeftIcon icon="eva:arrow-ios-forward-fill" isRTL={true} />);
    const iconElement = screen.getByTestId('iconify');
    // When isRTL is true, the transform should be overridden by "scaleX(1)".
    expect(iconElement.getAttribute('data-sx')).toContain('"transform":" scaleX(1)"');
  });
});

describe('RightIcon component', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    expect(baseElement).toMatchSnapshot();
  })

  it('renders correctly with isRTL false', () => {
    render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={false} />);
    const iconElement = screen.getByTestId('iconify');
    // When isRTL is false, no transform should be applied.
    // The sx prop should be an empty object.
    expect(iconElement.getAttribute('data-sx')).toBe('{}');
    expect(iconElement.getAttribute('data-icon')).toBe('eva:arrow-ios-forward-fill');
  });

  it('renders correctly with isRTL true', () => {
    render(<RightIcon icon="eva:arrow-ios-forward-fill" isRTL={true} />);
    const iconElement = screen.getByTestId('iconify');
    // When isRTL is true, the transform "scaleX(-1)" should be applied.
    expect(iconElement.getAttribute('data-sx')).toContain('"transform":" scaleX(-1)"');
  });
});
