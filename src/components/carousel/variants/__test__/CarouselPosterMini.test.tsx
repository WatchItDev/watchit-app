import { describe, it, expect } from 'vitest';

import CarouselPosterMini from '@src/components/carousel/variants/CarouselPosterMini';
import { CarouselPosterMiniProps } from '@src/components/carousel/types';
import {Testing} from "@src/utils/testing/Testing.tsx";

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
    },
    {
      id: '2',
      metadata: {
        title: 'Test 2 Title',
        content: 'Test 3 Content',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri' } } },
          { altTag: 'wallpaper', image: { raw: { uri: 'wallpaper-uri' } } },
        ],
      },
      globalStats: { upvotes: 150 },
    },
  ];

  const defaultProps: CarouselPosterMiniProps = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
  };

  it('to match snapshot', () => {
    const { baseElement } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const { container } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />);
    const slides = container.querySelectorAll('.lazy-load-image-background');
    expect(slides.length).toBe(mockData.length);
  });

  it('renders the title correctly', () => {
    const { getByText } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />);
    expect(getByText('Test Carousel')).toBeInTheDocument();
  });

  it('renders the correct poster URI for carousel items', () => {
    const { getAllByAltText } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />);
    const imgElement = getAllByAltText(/title/i);
    expect(imgElement.length).toBe(mockData.length);
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const { container } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...emptyProps} />);
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
