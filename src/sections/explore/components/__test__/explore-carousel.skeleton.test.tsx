import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ExploreCarouselSkeleton } from "../explore-carousel.skeleton";


vi.mock('@src/hooks/components/use-item-per-slide', () => ({
  useItemsPerSlide: () => ({
    itemsPerSlide: 3,
  }),
}));

describe("Testing in the <ExploreCarouselSkeleton/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreCarouselSkeleton title="Test" />);
    expect(container).toMatchSnapshot();
  });

  it("should render the title", () => {
    const { getByText } = render(<ExploreCarouselSkeleton title="Test" />);
    expect(getByText("Test")).toBeInTheDocument();
  });

  it('should render 6 skeleton items if itemsPerSlide is 3', () => {
    const { getAllByTestId } = render(<ExploreCarouselSkeleton title="Test" />);
    const skeletonItems = getAllByTestId('skeleton-item');
    expect(skeletonItems.length).toBe(6);
  });
});
