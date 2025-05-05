import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ExploreCarouselSkeleton } from "../explore-carousel.skeleton";

describe("Testing in the <ExploreCarouselSkeleton/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreCarouselSkeleton title="Test" />);
    expect(container).toMatchSnapshot();
  });

  it("should render the title", () => {
    const { getByText } = render(<ExploreCarouselSkeleton title="Test" />);
    expect(getByText("Test")).toBeInTheDocument();
  });

  it("should render 6 skeleton items if itemsPerSlide is 3", () => {
    vi.mock("@src/hooks/components/use-item-per-slide", () => ({
      useItemsPerSlide: () => ({
        itemsPerSlide: 3,
      }),
    }));

    const { getAllByTestId } = render(<ExploreCarouselSkeleton title="Test" />);
    const skeletonItems = getAllByTestId("skeleton-item");
    expect(skeletonItems.length).toBe(6);
  });

  it("should not render the title if not provided", () => {
    const { queryByText } = render(<ExploreCarouselSkeleton />);
    expect(queryByText("Test")).not.toBeInTheDocument();
  });

  it("should fail if skeleton items are not rendered correctly", () => {
    const { queryAllByTestId } = render(<ExploreCarouselSkeleton title="Test" />);
    const skeletonItems = queryAllByTestId("skeleton-item");
    expect(skeletonItems.length).not.toBe(0);
  });

  it("should fail if parentRef is not applied correctly", () => {
    const { container } = render(<ExploreCarouselSkeleton title="Test" />);
    const parentRefElement = container.querySelector("[ref]");
    expect(parentRefElement).toBeNull();
  });
});
