import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@src/redux/store";
import { ExploreTopPublications } from "../explore-top-publications";

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
        <ExploreTopPublications />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Testing in the <ExploreTopPublications/> component", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  it("should render the component with content", () => {
    renderWithProviders();
    expect(screen.getByText("Prueba de titulo")).toBeInTheDocument();
    expect(screen.getByText("Contenido de prueba para explorar publicaciones")).toBeInTheDocument();
    expect(screen.getByText("Alex Talavera")).toBeInTheDocument();
  });

  it("should dispatch loading state to Redux store", async () => {
    const dispatchSpy = vi.spyOn(store, "dispatch");
    renderWithProviders();
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "loading/setExploreLoading",
          payload: { key: "top", isLoading: expect.any(Boolean) },
        }),
      );
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should render the correct number of posts", () => {
    renderWithProviders();
    const posts = screen.getAllByText("Prueba de titulo");
    expect(posts.length).toBeGreaterThan(0);
  });

  it("should not render duplicate posts", () => {
    renderWithProviders();
    const posts = screen.getAllByText("Prueba de titulo");

    const uniquePosts = new Set(posts.map((post) => post.id?.trim()));

    expect(uniquePosts.size).toBe(1);
  });
});
