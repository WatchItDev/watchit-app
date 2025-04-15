import { describe, it, vi, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ExplorePublications } from "../explore-publications";

const mockUseResponsive = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("@src/hooks/use-responsive.ts", () => ({
  useResponsive: () => mockUseResponsive(),
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should match snapshot", () => {
    mockUseResponsive.mockReturnValue(true);
    const { container } = render(<ExplorePublications />);
    expect(container).toMatchSnapshot();
  });

  it("should render the ExplorePublications component with title", () => {
    mockUseResponsive.mockReturnValue(true);
    const { getByText } = render(<ExplorePublications />);
    expect(getByText("Publications")).toBeInTheDocument();
  });

  it("should dispatch setExploreLoading with loading false", () => {
    mockUseResponsive.mockReturnValue(true);
    render(<ExplorePublications />);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "loading/setExploreLoading",
      payload: {
        isLoading: false,
        key: "posts",
      },
    });
  });

  it("should set minItemWidth and maxItemWidth based on screen size", () => {
    mockUseResponsive.mockReturnValue(false); // mobile
    const { rerender } = render(<ExplorePublications />);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "loading/setExploreLoading",
      payload: {
        isLoading: false,
        key: "posts",
      },
    });

    mockUseResponsive.mockReturnValue(true); // desktop
    rerender(<ExplorePublications />);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "loading/setExploreLoading",
      payload: {
        isLoading: false,
        key: "posts",
      },
    });
  });
});
