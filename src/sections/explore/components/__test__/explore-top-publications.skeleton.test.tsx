import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ExploreTopPublicationsSkeleton } from '../explore-top-publications.skeleton';

describe('<ExploreTopPublicationsSkeleton />', () => {
  it('should match snapshot', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('should render the correct number of Skeleton components', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(9);
  });

  it('should include at least one Skeleton with large rectangular dimensions', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const rectangles = container.querySelectorAll('.MuiSkeleton-rectangular');
    expect(rectangles.length).toBeGreaterThan(0);
  });

  it('should include a Skeleton with width 14rem', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    const hasWidth = Array.from(skeletons).some((el) =>
      el.getAttribute('style')?.includes('width: 14rem'),
    );
    expect(hasWidth).toBe(true);
  });
  it('should include a Skeleton with height 2.5rem', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    const hasHeight = Array.from(skeletons).some((el) =>
      el.getAttribute('style')?.includes('height: 2.5rem'),
    );
    expect(hasHeight).toBe(true);
  });

  it('should fail if no Skeleton has a borderRadius of 1', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    const hasBorderRadius = Array.from(skeletons).some((skeleton) =>
      skeleton.getAttribute('style')?.includes('border-radius: 1'),
    );
    expect(hasBorderRadius).toBe(false);
  });

  it('should not have Skeletons without pulse animation', () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    const nonPulsing = Array.from(skeletons).some(
      (el) => !el.className.includes('MuiSkeleton-pulse'),
    );
    expect(nonPulsing).toBe(false);
  });
});
