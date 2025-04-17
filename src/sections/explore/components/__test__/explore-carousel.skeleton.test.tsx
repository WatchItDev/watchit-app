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

  it("should render the correct number of skeleton items", () => {
    const { getAllByTestId } = render(<ExploreCarouselSkeleton title="Test" />);
    const skeletonItems = getAllByTestId("skeleton-item");

    expect(skeletonItems.length).toBe(2);
  });
});
