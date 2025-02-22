import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CarouselWrapper from '@src/components/carousel/variants/CarouselWrapper';
import { CarouselWrapperProps } from '@src/components/carousel/types';

describe('[COMPONENTS]: CarouselWrapper', () => {
  const mockData = [
    { id: '1', metadata: { title: 'Test Title 1', content: 'Test Content 1' } },
    { id: '2', metadata: { title: 'Test Title 2', content: 'Test Content 2' } },
  ];

  const defaultProps: CarouselWrapperProps<typeof mockData[0]> = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
    renderSlide: (slideItems, itemsPerRow, index) => (
      <div key={`slide-${index}`} data-testid="slide">
        {slideItems.map((item) => (
          <div key={item.id} data-testid="item">
            {item.metadata.title}
          </div>
        ))}
      </div>
    ),
    carouselSettings: {
      infinite: false,
      slidesToShow: 1,
      speed: 500,
      rows: 1,
      slidesPerRow: 1,
      adaptiveHeight: true,
      focusOnSelect: true,
      swipeToSlide: true,
      lazyLoad: 'progressive',
    },
    boxStyle: {},
    boxClassName: '',
  };

  it('to match snapshot', () => {
    const { baseElement } = render(<CarouselWrapper {...defaultProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const { getAllByTestId } = render(<CarouselWrapper {...defaultProps} />);
    const slides = getAllByTestId('slide');
    expect(slides.length).toBe(1);
  });

  it('renders the correct number of items per slide', () => {
    const { getAllByTestId } = render(<CarouselWrapper {...defaultProps} />);
    const items = getAllByTestId('item');
    expect(items.length).toBe(mockData.length);
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<CarouselWrapper {...defaultProps} />);
    expect(getByText('Test Carousel')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const { container } = render(<CarouselWrapper {...emptyProps} />);
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
