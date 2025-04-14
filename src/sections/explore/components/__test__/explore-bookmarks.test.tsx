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
import { render, screen } from "@testing-library/react";
import { ExploreBookmarks } from "../explore-bookmarks";
import { Provider } from "react-redux";
import { store } from "@redux/store.ts";
import { MemoryRouter } from "react-router-dom";

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

vi.mock("@src/hooks/use-responsive.ts", () => ({
  useResponsive: () => true,
  useWidth: () => 1024,
}));

const renderWithProviders = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreBookmarks />
      </MemoryRouter>
    </Provider>,
  );

describe(" Testing in the <explore-bookmarks/> component ", () => {

  it(" should match snapshot ", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  it("should reverse the order of bookmarkPublications", () => {
    const { getByText } = renderWithProviders();
    expect(getByText("Bookmark 2 description")).toBeInTheDocument();
    expect(getByText("Bookmark 1 description")).toBeInTheDocument();
    expect(screen.queryByText("Bookmark 3 description")).not.toBeInTheDocument();
  });

  it("should render the ExploreBookmarks component", () => {
    const { getByText } = renderWithProviders();
    expect(getByText("Bookmarks")).toBeInTheDocument();
    expect(getByText("Bookmark 1 description")).toBeInTheDocument();
    expect(getByText("Bookmark 2 description")).toBeInTheDocument();
  });

  it("should not render hidden bookmarks", () => {
    const { queryByText } = renderWithProviders();
    expect(queryByText("Bookmark 3 description")).not.toBeInTheDocument();
  });

});
