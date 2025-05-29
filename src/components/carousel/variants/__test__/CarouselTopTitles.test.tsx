import { describe, it, expect } from "vitest";
import { renderWithStoreAndRouter } from "@src/utils/testing/Testing";
import { CarouselTopTitlesProps } from "@src/components/carousel/types";
import { screen } from "@testing-library/dom";
import CarouselTopTitles from "../carousel-top-titles";

describe("[COMPONENTS]: CarouselTopTitles", () => {
  const mockPosts = [
    {
      id: "1",
      title: "Test Title 1",
      description: "Test Content 1",
      attachments: [
        { type: "poster", cid: "poster-cid-1" },
        { type: "wallpaper", cid: "wallpaper-cid-1" },
      ],
      author: {
        address: "0x123",
        profilePicture: "profile-pic-1.jpg",
        displayName: "Author 1",
        username: "author1",
      },
    },
    {
      id: "2",
      title: "Test Title 2",
      description: "Test Content 2",
      attachments: [
        { type: "poster", cid: "poster-cid-2" },
        { type: "wallpaper", cid: "wallpaper-cid-2" },
      ],
      author: {
        address: "0x456",
        profilePicture: "profile-pic-2.jpg",
        displayName: "Author 2",
        username: "author2",
      },
    },
  ];

  const defaultProps: CarouselTopTitlesProps = {
    posts: mockPosts,
    category: "Test Category",
  };

  it("to match snapshot", () => {
    expect(
      renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />).baseElement,
    ).toMatchSnapshot();
  });

  it("renders correctly", async () => {
    renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />);
    const displayName = await screen.findAllByText(/Author 1/i);
    expect(displayName.length).toBeGreaterThan(0);
    displayName.forEach((title) => expect(title).toBeInTheDocument());
  });

  it("renders the correct poster URIs", () => {
    const { getAllByAltText } = renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />);
    const posters = getAllByAltText("Test Title 1");
    expect(posters.length).toBe(4);
  });

  it("renders the title correctly", () => {
    expect(
      renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />).getAllByText(
        "Test Title 1",
      ),
    ).to.have.length(2);
  });

  it("handles empty posts gracefully", () => {
    const emptyProps = { ...defaultProps, posts: [] };
    const slides = renderWithStoreAndRouter(
      <CarouselTopTitles {...emptyProps} />,
    ).container.querySelectorAll(".slick-slide");
    expect(slides.length).toBe(0);
  });
});
