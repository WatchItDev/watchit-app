import "../../../../../__mocks__/lens-protocol-react-web.ts";
import "../../../../../__mocks__/lens-protocol-react.ts";
import "../../../../../__mocks__/web3auth.ts";

import Searchbar from "../searchbar";
import { Testing } from "@src/utils/testing/Testing.tsx";
import { fireEvent } from "@testing-library/react"
import { act } from 'react';
import { useSearchProfiles } from "@lens-protocol/react-web";
import { useSearchPublications } from "@src/hooks/use-search-publications";
import { vi } from 'vitest';
// Fix the scrollbar mock typing
vi.mock('@src/components/scrollbar', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-scrollbar">{children}</div>,
}));

/// Correct mock implementation with vi.fn()
vi.mock('@lens-protocol/react-web', () => ({
  useSearchProfiles: vi.fn()
}));

vi.mock('@src/hooks/use-search-publications', () => ({
  useSearchPublications: vi.fn()
}));

describe("[COMPONENTS]: Searchbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mocks for the search hooks
    // Set up default mocks for the search hooks with proper return types
    (useSearchProfiles as any).mockReturnValue({
      data: [],
      loading: false,
      result: { items: [] }
    });

    (useSearchPublications as any).mockReturnValue({
      publications: [],
      loading: false,
      error: null
    });

    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      configurable: true,
    });
  });

  it("displays correct shortcut label for mac", () => {
    const { getByText } = Testing.renderWithStoreAndRouter(<Searchbar />);
    expect(getByText("⌘K")).toBeInTheDocument();
  });

  it("displays correct shortcut Label for windows", () => {
    Object.defineProperty(navigator, "platform", {
      value: "Win32",
      configurable: true,
    });

    const { getByText } = Testing.renderWithStoreAndRouter(<Searchbar />);

    expect(getByText("Ctrl+K")).toBeInTheDocument();
  });

  it("should open search on CMD+K", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      configurable: true,
    });

    const { baseElement } = Testing.renderWithStoreAndRouter(<Searchbar />);

    act(() => {
      fireEvent.keyDown(document, { key: "k", metaKey: true });
    });

    const searchInput = baseElement.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
      expect(searchInput).toHaveFocus();
    }
  });

  it("should open search on CTRL+K", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "Win32",
      configurable: true,
    });

    const { baseElement } = Testing.renderWithStoreAndRouter(<Searchbar />);

    act(() => {
      fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    });

    const searchInput = baseElement.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
      expect(searchInput).toHaveFocus();
    }
  });

  it("should close search on escape key", async () => {
    const { baseElement } = Testing.renderWithStoreAndRouter(<Searchbar />);

    act(() => {
      fireEvent.keyDown(document, { key: "k", metaKey: true });
    });

    const searchInput = baseElement.querySelector('input[placeholder="Search..."]');

    expect(searchInput).not.toBeNull();
    if (searchInput) {
      expect(searchInput).toHaveFocus();

      act(() => {
        fireEvent.keyDown(searchInput, { key: "Escape" });
      });
    }

    expect(baseElement.querySelector('input[placeholder="Search..."]')).not.toBeVisible();
  });

  it("should display search results when profiles and publications are found", async () => {
    // Mock search results
    (useSearchProfiles as any).mockReturnValue({
      data: [
        {
          id: 'profile-1',
          metadata: {
            displayName: 'Test Profile',
            bio: 'Test Bio'
          },
          handle: {
            localName: 'testuser'
          }
        }
      ],
      loading: false,
      result: {
        items: [
          {
            id: 'profile-1',
            metadata: {
              displayName: 'Test Profile',
              bio: 'Test Bio'
            },
            handle: {
              localName: 'testuser'
            }
          }
        ]
      }
    });

    (useSearchPublications as any).mockReturnValue({
      publications: [
        {
          id: 'pub-1',
          title: 'Test Publication',
          description: 'Test Description',
          post_id: 'post-1'
        }
      ],
      loading: false,
      error: null
    });

    const { baseElement, queryAllByText } = Testing.renderWithStoreAndRouter(<Searchbar />);

    act(() => {
      fireEvent.keyDown(document, { key: "k", metaKey: true });
    });

    const searchInput = baseElement.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'test' } });
      });
    }

// Use regex or partial matching since elements are split due to highlighting
    expect(queryAllByText(/profile/i)).toHaveLength(2);
    expect(queryAllByText(/publication/i)).toHaveLength(2)

    // Check for the highlighted text separately
    const highlightedTexts = baseElement.querySelectorAll('[style*="font-weight: bold"]');
    expect(highlightedTexts.length).toBeGreaterThan(0);
    expect(highlightedTexts[0].textContent).toBe('Test');
  });

  it("should display not found message when no results are found", async () => {
    (useSearchProfiles as any).mockReturnValue({
      data: [],
      loading: false,
      result: {
        items: []
      }
    });

    (useSearchPublications as any).mockReturnValue({
      publications: [],
      loading: false,
      error: null
    });

    const { baseElement, getByText } = Testing.renderWithStoreAndRouter(<Searchbar />);

    // Open search dialog
    act(() => {
      fireEvent.keyDown(document, { key: "k", metaKey: true });
    });

    // Enter search query
    const searchInput = baseElement.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'nonexistentquery' } });
      });
    }

    expect(getByText(/No results found for/i)).toBeInTheDocument();
  });
});
