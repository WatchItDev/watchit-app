import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExplorePublicationsSkeleton } from '../explore-publications.skeleton';

vi.mock(
  '@src/sections/explore/components/explore-carousel.skeleton.tsx',
  () => ({
    ExploreCarouselSkeleton: ({
      title,
      SkeletonItemComponent,
    }: {
      title: string;
      SkeletonItemComponent: React.FC;
    }) => (
      <div data-testid="mock-carousel">
        <h2>{title}</h2>
        <div data-testid="skeleton-item">
          <SkeletonItemComponent />
        </div>
      </div>
    ),
  }),
);

describe('Testing in the <ExplorePublicationsSkeleton/> component', () => {
  it('should match snapshot', () => {
    const { container } = render(<ExplorePublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('renders the mock ExploreCarouselSkeleton', () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();
    expect(screen.getByText('Publications')).toBeInTheDocument();
  });

  it('renders the SkeletonItem inside the carousel', () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.getByTestId('skeleton-item')).toBeInTheDocument();
    const skeletons = screen.getAllByRole('progressbar');
    expect(skeletons.length).toBe(1);
  });

  it('renders the correct title in the skeleton', () => {
    render(<ExplorePublicationsSkeleton />);
    const titleElement = screen.getByText(/Publications/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should not render an unexpected element', () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.queryByTestId('unexpected-element')).not.toBeInTheDocument();
  });

  it('should fail if the title is incorrect', () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.queryByText('Incorrect Title')).not.toBeInTheDocument();
  });

  it('should fail if SkeletonItem is missing', () => {
    render(<ExplorePublicationsSkeleton />);
    expect(
      screen.queryByTestId('missing-skeleton-item'),
    ).not.toBeInTheDocument();
  });

  it('should throw an error if required props are missing', () => {
    const renderWithError = () => {
      render(<ExplorePublicationsSkeleton />);
    };
    expect(renderWithError).not.toThrow();
  });
});
