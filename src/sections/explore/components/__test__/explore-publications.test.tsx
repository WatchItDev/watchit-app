import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ExplorePublications } from "../explore-publications";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router";
import { explorePublicationsMocks } from "./__mocks__/explorePublications.mocks";

const mockUseResponsive = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("@src/hooks/use-responsive.ts", async () => {
  const actual = await import("@src/hooks/use-responsive.ts");
  return {
    ...actual,
    useResponsive: () => mockUseResponsive(),
  };
});

vi.mock("@src/hooks/protocol/use-explore.ts", () => ({
  useExplore: () => ({
    getAllPosts: vi.fn(),
  }),
}));

const renderComponent = () => {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MockedProvider mocks={explorePublicationsMocks} addTypename={false}>
        <ExplorePublications />
      </MockedProvider>
    </MemoryRouter>,
  );
};

describe("Testing in the <ExplorePublications/> component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render the ExplorePublications component with title", () => {
    mockUseResponsive.mockReturnValue(true);
    const { getAllByText } = renderComponent();
    const titles = getAllByText("Publications");
    expect(titles.length).toBeGreaterThan(0);
    screen.debug()
  });

  // it("should dispatch setExploreLoading with loading true", () => {
  //   mockUseResponsive.mockReturnValue(true);
  //   renderComponent();
  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: "loading/setExploreLoading",
  //     payload: {
  //       isLoading: true,
  //       key: "posts",
  //     },
  //   });
  // });

  // it("should set minItemWidth and maxItemWidth based on screen size", async () => {
  //   mockUseResponsive.mockReturnValue(false);
  //   renderComponent();

  //   await waitFor(() =>
  //     expect(mockDispatch).toHaveBeenCalledWith({
  //       type: "loading/setExploreLoading",
  //       payload: {
  //         isLoading: false,
  //         key: "posts",
  //       },
  //     }),
  //   );
  //   mockUseResponsive.mockReturnValue(true);
  //   await waitFor(() => {
  //     render(
  //       <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  //         <MockedProvider mocks={explorePublicationsMocks} addTypename={false}>
  //           <ExplorePublications />
  //         </MockedProvider>
  //       </MemoryRouter>,
  //     );
  //     expect(mockDispatch).toHaveBeenCalledWith({
  //       type: "loading/setExploreLoading",
  //       payload: {
  //         isLoading: false,
  //         key: "posts",
  //       },
  //     });
  //   });
  // });
});
