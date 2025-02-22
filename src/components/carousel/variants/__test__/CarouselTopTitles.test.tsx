import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Testing } from '@src/utils/testing/Testing';
import CarouselTopTitles from '@src/components/carousel/variants/CarouselTopTitles';
import { CarouselTopTitlesProps } from '@src/components/carousel/types';
import {renderWithLensProvider} from "@src/utils/testing/Testing.tsx";

describe('[COMPONENTS]: CarouselTopTitles', () => {
  const mockPosts = [
    {
      id: '1',
      metadata: {
        title: 'Test Title 1',
        content: 'Test Content 1',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri-1' } } },
        ],
      },
    },
    {
      id: '2',
      metadata: {
        title: 'Test Title 2',
        content: 'Test Content 2',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri-2' } } },
        ],
      },
    },
  ];

  const defaultProps: CarouselTopTitlesProps = {
    posts: mockPosts,
    category: 'Test Category',
  };

  it('to match snapshot', () => {
    const { baseElement } = Testing.renderWithLensProvider(<CarouselTopTitles {...defaultProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const { getAllByRole } = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />);
    const slides = getAllByRole('listitem');
    expect(slides.length).toBe(mockPosts.length);
  });

  it('renders the correct poster URIs', () => {
    const { getByAltText } = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />);
    expect(getByAltText('Test Title 1')).toHaveAttribute('src', 'poster-uri-1');
    expect(getByAltText('Test Title 2')).toHaveAttribute('src', 'poster-uri-2');
  });

  it('renders the title correctly', () => {
    const { getByText } = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />);
    expect(getByText('Test Category')).toBeInTheDocument();
  });

  it('handles empty posts gracefully', () => {
    const emptyProps = { ...defaultProps, posts: [] };
    const { container } = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...emptyProps} />);
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
