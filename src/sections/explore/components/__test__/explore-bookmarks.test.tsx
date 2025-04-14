import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@redux/store.ts";
import { MemoryRouter } from "react-router-dom";

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

vi.mock("@src/hooks/use-responsive.ts", () => ({
  useResponsive: () => true,
  useWidth: () => 1024,
}));

vi.mock("@lens-protocol/react-web", () => ({
  useBookmarks: () => ({
    data: [
      {
        id: "1",
        isHidden: false,
        globalStats: { upvotes: 100, downvotes: 5 },
        metadata: { content: "Bookmark 1 description" },
      },
      {
        id: "2",
        isHidden: false,
        globalStats: { upvotes: 200, downvotes: 10 },
        metadata: { content: "Bookmark 2 description" },
      },
      {
        id: "3",
        isHidden: true,
        globalStats: { upvotes: 150, downvotes: 3 },
        metadata: { content: "Bookmark 3 description" },
      },
    ],
  }),
}));

const renderWithProviders = async () => {
  const { ExploreBookmarks } = await import("../explore-bookmarks");
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreBookmarks />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Testing in the <ExploreBookmarks/> component", () => {
  it("should match snapshot", async () => {
    const { container } = await renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  it("should reverse the order of bookmarkPublications", async () => {
    await renderWithProviders();
    expect(screen.getByText("Bookmark 2 description")).toBeInTheDocument();
    expect(screen.getByText("Bookmark 1 description")).toBeInTheDocument();
    expect(screen.queryByText("Bookmark 3 description")).not.toBeInTheDocument();
  });

  it("should render the ExploreBookmarks component", async () => {
    await renderWithProviders();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Bookmark 1 description")).toBeInTheDocument();
    expect(screen.getByText("Bookmark 2 description")).toBeInTheDocument();
  });

  it("should not render hidden bookmarks", async () => {
    await renderWithProviders();
    expect(screen.queryByText("Bookmark 3 description")).not.toBeInTheDocument();
  });

  it("should render nothing when bookmarks are empty", async () => {
    vi.doMock("@lens-protocol/react-web", () => ({
      useBookmarks: () => ({
        data: [],
      }),
    }));
    vi.resetModules();
    const { container } = await renderWithProviders();
    expect(container).toBeEmptyDOMElement();
  });
});
