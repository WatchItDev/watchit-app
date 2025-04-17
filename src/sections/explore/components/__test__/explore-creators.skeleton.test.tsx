
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExploreCreatorsSkeleton } from "../explore-creators.skeleton";
import { ExploreCarouselSkeleton } from "@src/sections/explore/components/explore-carousel.skeleton";

vi.mock("@src/sections/explore/components/explore-carousel.skeleton", () => ({
  ExploreCarouselSkeleton: vi.fn(() => <div data-testid="explore-carousel-skeleton" />),
}));

describe("Testing in the <ExploreCreatorsSkeleton/>", () => {
  it("should render the skeleton and match snapshot", () => {
    const { container } = render(<ExploreCreatorsSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it("should render the ExploreCarouselSkeleton component", () => {
    render(<ExploreCreatorsSkeleton />);
    expect(screen.getByTestId("explore-carousel-skeleton")).toBeInTheDocument();
  });

  it("should pass the correct props to ExploreCarouselSkeleton", () => {
    render(<ExploreCreatorsSkeleton />);
    expect(ExploreCarouselSkeleton).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Latest creators",
        SkeletonItemComponent: expect.any(Function),
      }),
      {}
    );
  });
});
