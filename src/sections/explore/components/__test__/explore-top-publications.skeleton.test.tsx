import { describe, expect, it } from "vitest";
import { render} from "@testing-library/react";
import { ExploreTopPublicationsSkeleton } from "../explore-top-publications.skeleton";

describe("<ExploreTopPublicationsSkeleton />", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreTopPublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
