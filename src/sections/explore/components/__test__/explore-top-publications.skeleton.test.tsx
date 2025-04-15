import { describe, expect, it } from "vitest";
import { render} from "@testing-library/react";
import { ExploreTopPublicationsSkeleton } from "../explore-top-publications.skeleton";

describe("<ExploreTopPublicationsSkeleton />", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it("should render the correct number of Skeleton components", () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBe(9);
  });
});
