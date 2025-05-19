import { describe, expect, it, vi } from "vitest";
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

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useSelector: (selector: any) =>
      selector({
        bookmark: {
          bookmarkPublications: [{ id: "1", isHidden: false }],
          hiddenBookmarks: [],
        },
        loading: {
          explore: "succeeded",
        },
      }),
  };
});

vi.mock("@src/hooks/use-bookmark.ts", () => ({
  useBookmarks: () => ({
    data: [{ id: "2", isHidden: false }],
  }),
}));

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

    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
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

  it("should not render bookmarks when user is not authenticated", () => {
    vi.spyOn(authHook, "useAuth").mockReturnValue({
      session: {
        address: undefined,
        authenticated: false,
        user: undefined,
        info: undefined,
      },
      isAuthLoading: false,
      isLoginModalOpen: false,
      balance: 0,
    });
    renderWithProviders();
    expect(screen.queryByText(/Bookmarks/i)).not.toBeInTheDocument();
  });

  it("should render bookmarks when user is authenticated", () => {
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
    expect(screen.getByText(/Bookmarks/i)).toBeInTheDocument();
  });
});
