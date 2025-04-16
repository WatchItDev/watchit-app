import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
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
  useExploreProfiles: () => ({
    data: [
      {
        id: "profile1",
        name: "Creator 1",
        stats: { followers: 1000 },
      },
      {
        id: "profile2",
        name: "Creator 2",
        stats: { followers: 2000 },
      },
    ],
    loading: false,
  }),
  ExploreProfilesOrderByType: {
    LatestCreated: "LatestCreated",
  },
  LimitType: {
    Fifty: "Fifty",
  },
}));

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreCreators />
      </MemoryRouter>
    </Provider>,
  );
};
describe("Testing in the ExploreCreators component ", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });
});
