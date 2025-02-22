import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '@redux/reducer';
import { BrowserRouter as Router } from 'react-router-dom';

import { URI } from '@lens-protocol/react';
import {ProfileId} from "@lens-protocol/react-web";

import CarouselCreators from '@src/components/carousel/variants/CarouselCreators';
import { CarouselCreatorsProps } from '@src/components/carousel/types';

vi.mock('@lens-protocol/react-web', () => {
  return {
    useLazyProfile: vi.fn(() => ({
      data: { id: '1', operations: { isFollowedByMe: { value: true } } },
      execute: vi.fn(),
      loading: false,
      error: null,
    })),
    // Mock useProfile hook
    useProfile: vi.fn(() => ({
      data: {
        id: '0x123',
        handle: 'testuser',
        name: 'Test User',
      },
      loading: false,
      error: null,
    })),
    // Mock usePublications hook
    usePublications: vi.fn(() => ({
      data: [
        {
          id: '0x456',
          content: 'This is a test publication',
        },
      ],
      loading: false,
      error: null,
    })),
    // Add more hooks here if needed...
  };
});

describe('[COMPONENTS]: CarouselCreators', () => {
  const mockData = [
    {
      id: '1' as ProfileId,
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

  const store = createStore(rootReducer);
  const RenderComponent = () => render(
    <Provider store={store}>
      <Router>
          <CarouselCreators {...defaultProps} />
      </Router>
    </Provider>
  );

  it('to match snapshot', () => {
    expect(RenderComponent().baseElement).toMatchSnapshot();
  });

  it('renders the correct number of slides', () => {
    const { getAllByRole } = render(RenderComponent());
    const slides = getAllByRole('listitem');
    expect(slides.length).toBe(mockData.length);
  });

  it('applies the correct carousel settings', () => {
    const { container } = render(<CarouselCreators {...defaultProps} />);
    const slickTrack = container.querySelector('.slick-track');
    expect(slickTrack).toHaveStyle('height: 100%');
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<CarouselCreators {...defaultProps} />);
    expect(getByText('Test Carousel')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] };
    const { container } = render(<CarouselCreators {...emptyProps} />);
    const slides = container.querySelectorAll('.slick-slide');
    expect(slides.length).toBe(0);
  });
});
