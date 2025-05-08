import '../../../../../__mocks__/web3auth';
import { describe, it, expect } from 'vitest';
import { renderWithStoreAndRouter } from '@src/utils/testing/Testing';
import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';
import { CarouselPosterMiniProps } from '@src/components/carousel/types';

describe('[COMPONENTS]: CarouselPosterMini', () => {
  const mockData = [
    {
      id: '1',
      metadata: {
        title: 'Test Title',
        content: 'Test Content',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri' } } },
          { altTag: 'wallpaper', image: { raw: { uri: 'wallpaper-uri' } } },
        ],
      },
      globalStats: { upvotes: 10 },
    }
  ];

  const defaultProps: CarouselPosterMiniProps = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
  };

  it('to match snapshot', () => {
    expect(renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const slides = renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(1);
  });

  it('renders the correct poster URIs', () => {
    const { getAllByAltText } = renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />);
    expect(getAllByAltText('Test Title')[0]).toHaveAttribute('src', 'poster-uri');
  });

  it('renders the title correctly', () => {
    expect(renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).getByText('Test Carousel')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const slides = renderWithStoreAndRouter(<CarouselPosterMini {...emptyProps} />).container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
