import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExploreCreators } from "../explore-creators";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";
import { MemoryRouter } from "react-router";
import { MockedProvider } from "@apollo/client/testing";
import { exploreViewMock } from "../../views/__test__/__mock__/exploreView.mock";

vi.mock("@src/workers/backgroundTaskWorker?worker", () => {
  return {
    default: class {
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    },
  };
});

vi.mock("@src/hooks/protocol/fetch-has-role", () => ({
  fetchHasRole: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@src/hooks/components/use-item-per-slide", () => {
  return {
    useItemsPerSlide: () => ({
      itemsPerSlide: 2,
      parentRef: {
        current: {
          offsetWidth: 600,
        },
      },
    }),
  };
});
vi.mock("@src/config-global.ts", () => ({
  GLOBAL_CONSTANTS: {
    ACCESS_MANAGER_ADDRESS: "0x0000000000000000000000000000000000000001",
  },
}));

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MockedProvider mocks={exploreViewMock} addTypename={false}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ExploreCreators />
        </MemoryRouter>
      </MockedProvider>
    </Provider>,
  );
};

describe("Testing in the ExploreCreators component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should render creators and match snapshot", async () => {
    const { container } = renderWithProviders();
    await screen.findByText("Recent User");
    expect(container).toMatchSnapshot();
  });
  it("should render the correct number of creators", async () => {
    renderWithProviders();
    const creators = await screen.findAllByText("Recent User");
    expect(creators.length).toBe(1);
  });
  it("should not render hidden creators", () => {
    renderWithProviders();
    const hiddenCreator = screen.queryByText("Hidden User");
    expect(hiddenCreator).not.toBeInTheDocument();
  });

  it("should show skeleton when loading", () => {
    renderWithProviders();
    const skeletons = screen.getAllByTestId("skeleton-item");
    expect(skeletons.length).toBeGreaterThan(0);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toBeInTheDocument();
    });
  });
});
