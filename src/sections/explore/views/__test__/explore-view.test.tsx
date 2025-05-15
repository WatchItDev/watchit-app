import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExploreView from "../explore-view";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";
import { MemoryRouter } from "react-router";
// import * as authHook from "@src/hooks/use-auth.ts";

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

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreView />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Testing in the <ExploreView/> component", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  // it("should render all public sections of ExploreView", () => {
  //   vi.spyOn(authHook, "useAuth").mockReturnValue({ isFullyAuthenticated: true });
  //   renderWithProviders();
  //   expect(screen.getByText(/Latest creators/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Publications/i)).toBeInTheDocument();
  // });
  //
  // it("should not render bookmarks when user is not authenticated", () => {
  //   vi.spyOn(authHook, "useAuth").mockReturnValue({ isFullyAuthenticated: false });
  //   renderWithProviders();
  //   expect(screen.queryByText(/Bookmarks/i)).not.toBeInTheDocument();
  // });
  //
  // it("should render bookmarks when user is authenticated", () => {
  //   vi.spyOn(authHook, "useAuth").mockReturnValue({ isFullyAuthenticated: true });
  //   renderWithProviders();
  //   expect(screen.getByText(/Bookmarks/i)).toBeInTheDocument();
  // });
});
