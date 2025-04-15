import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ExploreTopPublicationsSkeleton } from "../explore-top-publications.skeleton";

describe("Testing in the <explore-top-publications.skeleton/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
