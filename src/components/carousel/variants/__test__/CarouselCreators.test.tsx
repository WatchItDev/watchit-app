import '../../../../../__mocks__/lens-protocol-react';
import '../../../../../__mocks__/lens-protocol-react-web';
import '../../../../../__mocks__/web3auth';
import { describe, it, expect } from 'vitest';
import { URI } from '@lens-protocol/react';
import CarouselCreators from '@src/components/carousel/variants/carousel-creators.tsx';
import { CarouselCreatorsProps } from '@src/components/carousel/types.ts';
import {Testing} from "@src/utils/testing/Testing.tsx";

describe('[COMPONENTS]: CarouselCreators', () => {
  const mockData = [
    {
      id: '1',
      metadata: {
        picture: null,
        __typename: 'ProfileMetadata',
        bio: null,
        rawURI: 'https://watchit.movie' as URI,
        appId: null,
        coverPicture: null,
        displayName: 'Test User 1',
        attributes: null
      },
      __typename: "Profile",
      invitedBy: null,
    },
  ];

  const defaultProps: CarouselCreatorsProps = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
  };

  it('to match snapshot', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselCreators {...defaultProps} />).baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const slides = Testing.renderWithStoreAndRouter(<CarouselCreators {...defaultProps} />).container.querySelectorAll('.slick-slider');
    expect(slides.length).toBe(mockData.length);
  });

  it('applies the correct carousel settings', () => {
    const slickTrack = Testing.renderWithStoreAndRouter(<CarouselCreators {...defaultProps} />).container.querySelector('.slick-track');
    expect(slickTrack).toHaveStyle('height: 100%');
  });

  it('renders the title correctly', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselCreators {...defaultProps} />).getByText('Test Carousel')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const slides = Testing.renderWithStoreAndRouter(<CarouselCreators {...emptyProps} />).container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
