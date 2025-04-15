import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExploreLoader from "../explore-loader";

vi.mock("@src/components/loading-screen", () => ({
  LoadingScreen: () => (
    <div
      data-testid="loading-screen"
      style={{
        zIndex: "999",
        background: "#1E1F22",
        position: "absolute",
        top: "0",
        left: "0",
        bottom: "0",
        pointerEvents: "none",
        right: "0",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}>
      Loading...
    </div>
  ),
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

  it("renders the LoadingScreen component with correct styles", () => {
    render(<ExploreLoader />);
    const loadingScreen = screen.getByTestId("loading-screen");
    expect(loadingScreen).toHaveStyle({
      zIndex: "999",
      background: "#1E1F22",
      position: "absolute",
      top: "0",
      left: "0",
      bottom: "0",
      pointerEvents: "none",
      right: "0",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    });
  });
});
