import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExploreCreators } from "../explore-creators";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";
import { MemoryRouter } from "react-router";

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

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreCreators />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Testing in the ExploreCreators component", () => {
  it("should render creators and match snapshot", async () => {
    const { container } = renderWithProviders();

    await screen.findByText("Creator 1");
    await screen.findByText("Creator 2");
    expect(container).toMatchSnapshot();
  });
  it("should render the correct number of creators", async () => {
    renderWithProviders();
    await screen.findByText("Creator 1");
    await screen.findByText("Creator 2");
    const creators = screen.getAllByText(/Creator/);
    expect(creators.length).toBe(2);
  });
  it("should not render hidden creators", async () => {
    renderWithProviders();
    await screen.findByText("Creator 1");
    await screen.findByText("Creator 2");
    expect(screen.queryByText("Hidden Creator")).not.toBeInTheDocument();
  });

  it("should dispatch loading state to Redux store", async () => {
    const dispatchSpy = vi.spyOn(store, "dispatch");
    renderWithProviders();
    await screen.findByText("Creator 1");
    await screen.findByText("Creator 2");
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "loading/setExploreLoading",
        payload: { key: "creators", isLoading: false },
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.resetModules();
  });
});
