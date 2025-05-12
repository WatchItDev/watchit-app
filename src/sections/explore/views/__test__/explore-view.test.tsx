import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ExploreView from "../explore-view";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";
import { MemoryRouter } from "react-router";
import { MockedProvider } from "@apollo/client/testing";
import { exploreViewMock } from "./__mock__/exploreView.mock";
import * as authHook from "@src/hooks/use-auth";

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
      <MockedProvider mocks={exploreViewMock} addTypename={false}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ExploreView />
        </MemoryRouter>
      </MockedProvider>
    </Provider>,
  );
};

describe("Testing in the <ExploreView/> component", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
    screen.debug();
  });

    it("should render all public sections of ExploreView", () => {
      vi.spyOn(authHook, "useAuth").mockReturnValue({
        session: {
          address: undefined,
          authenticated: true,
          user: undefined,
          info: undefined,
        },
        isAuthLoading: false,
        isLoginModalOpen: false,
        balance: 0,
      });
      renderWithProviders();

      expect(screen.getByText(/Publications/i)).toBeInTheDocument();
    });
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
