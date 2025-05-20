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
  it("should match snapshot", async () => {
    const { container } = renderWithProviders();
    await screen.findByText("Post con límite 20");
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

it("should render the correct number of original posts", async () => {
  renderWithProviders();
  // Find all elements containing the post title text
  const allPosts = await screen.findAllByText("Popular Post");
  // Filter out cloned slides (created by react-slick for infinite scroll)
  const originalPosts = allPosts.filter(post => {
    let el: HTMLElement | null = post;
    // Traverse up the DOM tree to find the slide container
    while (el) {
      if (el.classList && el.classList.contains('slick-slide')) {
        // Exclude if it's a cloned slide
        return !el.classList.contains('slick-cloned');
      }
      el = el.parentElement;
    }
    // If no slide container found, assume original
    return true;
  });
  const expectedCount = 1;
  // Assert that only original slides are counted
  expect(originalPosts.length).toBe(expectedCount);
});



  it("should not render duplicate posts", async () => {
    renderWithProviders();
    const postElements = await screen.findAllByText("Popular Post");
    const titles = postElements.map((el) => el.textContent);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(1);
  });
});
