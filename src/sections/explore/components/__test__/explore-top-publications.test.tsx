import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@src/redux/store";
import { ExploreTopPublications } from "../explore-top-publications";
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

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MockedProvider mocks={exploreViewMock} addTypename={false}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ExploreTopPublications />
        </MemoryRouter>
      </MockedProvider>
    </Provider>,
  );
};

describe("Testing in the <ExploreTopPublications/> component", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();

    expect(container).toMatchSnapshot();
    screen.debug();
  });

  it("should render the component with content", async () => {
    renderWithProviders();
    const title = await screen.findByText("Post con límite 20");

    expect(title).toBeInTheDocument();
  });

  it("should dispatch loading state to Redux store", async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(store.getState().loading.explore.top).toBe(true);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should render the correct number of posts", async () => {
    renderWithProviders();
    const posts = await screen.findAllByText("Popular Post");
    const postCount = posts.length;
    const expectedCount = 2;
    expect(postCount).toBe(expectedCount);
  });

  // it("should not render duplicate posts", async () => {
  //   renderWithProviders();
  //   const renderedPosts = screen.getAllByTestId("post-item");
  //   const postIds = renderedPosts.map((el) => el.getAttribute("data-id"));
  //   const uniqueIds = new Set(postIds);

  //   expect(uniqueIds.size).toBe(postIds.length);
  // });
});
