import { describe, it, vi, expect } from "vitest";
import { render } from "@testing-library/react";
import { ExplorePublications } from "../explore-publications";

const mockDispatch = vi.fn();
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("@src/hooks/use-responsive.ts", () => ({
  useResponsive: () => true,
}));

vi.mock("@lens-protocol/react-web", async () => {
  const actual = await import("@lens-protocol/react-web");
  return {
    ...actual,
    appId: (id: string) => id,
    usePublications: () => ({
      data: [],
      loading: false,
    }),
    PublicationType: {
      Post: "Post",
    },
  };
});

describe("Testing in the <ExplorePublications/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExplorePublications />);
    expect(container).toMatchSnapshot();
  });

  it("should render the ExplorePublications component with title", () => {
    const { getByText } = render(<ExplorePublications />);
    expect(getByText("Publications")).toBeInTheDocument();
  });

  it("should dispatch setExploreLoading with loading false", () => {
    render(<ExplorePublications />);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "loading/setExploreLoading",
      payload: {
        isLoading: false,
        key: "posts",
      },
    });
  });
});
