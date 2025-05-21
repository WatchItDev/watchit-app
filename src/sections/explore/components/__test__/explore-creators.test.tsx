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
  it("should render creators and match snapshot", async () => {
    const { container } = renderWithProviders();

    await screen.findByText("Recent User");

    expect(container).toMatchSnapshot();
  });
  // it("should render the correct number of creators", async () => {
  //   renderWithProviders();
  //   await screen.findByText("Creator 1");
  //   await screen.findByText("Creator 2");
  //   const creators = screen.getAllByText(/Creator/);
  //   expect(creators.length).toBe(2);
  // });
  // it("should not render hidden creators", async () => {
  //   renderWithProviders();
  //   await screen.findByText("Creator 1");
  //   await screen.findByText("Creator 2");
  //   expect(screen.queryByText("Hidden Creator")).not.toBeInTheDocument();
  // });

  // it("should dispatch loading state to Redux store", async () => {
  //   const dispatchSpy = vi.spyOn(store, "dispatch");
  //   renderWithProviders();
  //   await screen.findByText("Creator 1");
  //   await screen.findByText("Creator 2");
  //   expect(dispatchSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       type: "loading/setExploreLoading",
  //       payload: { key: "creators", isLoading: false },
  //     }),
  //   );
  //   expect(dispatchSpy).toHaveBeenCalledTimes(1);
  // });

  // afterEach(() => {
  //   vi.resetModules();
  // });
});
