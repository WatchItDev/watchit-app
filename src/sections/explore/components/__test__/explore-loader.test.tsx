import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExploreLoader from "../explore-loader";

vi.mock("@src/components/loading-screen", () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

describe("Testing in the <explore-loader/> component ", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExploreLoader />);
    expect(container).toMatchSnapshot();
  });

  it("renders the LoadingScreen component within the layout", () => {
    render(<ExploreLoader />);
    expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
  });
});
