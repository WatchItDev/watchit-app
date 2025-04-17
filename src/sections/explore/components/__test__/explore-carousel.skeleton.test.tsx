import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ExploreCarouselSkeleton } from "../explore-carousel.skeleton";

describe("Testing in the <ExploreCarouselSkeleton/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreCarouselSkeleton title="Test" />);
    expect(container).toMatchSnapshot();
  });
});
