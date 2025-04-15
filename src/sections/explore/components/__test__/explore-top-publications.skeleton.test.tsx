import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExplorePublicationsSkeleton } from "../explore-publications.skeleton";

vi.mock("@src/sections/explore/components/explore-carousel.skeleton.tsx", () => ({
  ExploreCarouselSkeleton: ({
    title,
    SkeletonItemComponent,
  }: {
    title: string;
    SkeletonItemComponent: React.ReactNode;
  }) => (
    <div data-testid="mock-carousel">
      <h2>{title}</h2>
      <div data-testid="skeleton-item">{SkeletonItemComponent}</div>
    </div>
  ),
}));

describe("Testing in the <ExplorePublicationsSkeleton/> component", () => {
  it("should match snapshot", () => {
    const { container } = render(<ExplorePublicationsSkeleton />);
    expect(container).toMatchSnapshot();
  });
  it("renders the mock ExploreCarouselSkeleton", () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
    expect(screen.getByText("Publications")).toBeInTheDocument();
  });

  it("renders the SkeletonItem inside the carousel", () => {
    render(<ExplorePublicationsSkeleton />);
    expect(screen.getByTestId("skeleton-item")).toBeInTheDocument();
    const skeletons = screen.getAllByRole("progressbar");
    expect(skeletons.length).toBe(1);
  });
});
