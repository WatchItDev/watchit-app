import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@redux/store.ts';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

vi.mock('@src/workers/backgroundTaskWorker?worker', () => {
  return {
    default: class {
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    },
  };
});

vi.mock('@src/hooks/use-responsive.ts', () => ({
  useResponsive: () => true,
  useWidth: () => 1024,
}));

const renderWithProviders = async () => {
  const { ExploreBookmarks } = await import('../explore-bookmarks');
  return render(
    <Provider store={store}>
      <MockedProvider>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <ExploreBookmarks />
        </MemoryRouter>
      </MockedProvider>
    </Provider>,
  );
};

vi.mock('@src/hooks/use-bookmark.ts', () => ({
  useBookmarks: () => ({
    data: [
      {
        id: '1',
        description: 'Bookmark 1 description',
        isHidden: false,
        likeCount: 100,
      },
      {
        id: '2',
        description: 'Bookmark 2 description',
        isHidden: false,
        likeCount: 200,
      },
      {
        id: '3',
        description: 'Bookmark 3 description',
        isHidden: true,
        likeCount: 150,
      },
    ],
  }),
}));

describe('Testing in the <ExploreBookmarks/> component', () => {
  it('should match snapshot', async () => {
    const { container } = await renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  it('should reverse the order of bookmarkPublications', async () => {
    await renderWithProviders();
    expect(screen.getByText('Bookmark 2 description')).toBeInTheDocument();
    expect(screen.getByText('Bookmark 1 description')).toBeInTheDocument();
    expect(
      screen.queryByText('Bookmark 3 description'),
    ).not.toBeInTheDocument();
  });

  it('should render the ExploreBookmarks component', async () => {
    await renderWithProviders();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Bookmark 1 description')).toBeInTheDocument();
    expect(screen.getByText('Bookmark 2 description')).toBeInTheDocument();
  });

  it('should not render hidden bookmarks', async () => {
    await renderWithProviders();
    expect(
      screen.queryByText('Bookmark 3 description'),
    ).not.toBeInTheDocument();
  });
  it('should render bookmarks with unique ids', async () => {
    await renderWithProviders();
    const bookmarks = screen.getAllByText(/Bookmark \d description/);
    const uniqueIds = new Set(
      bookmarks.map((bookmark) => bookmark.textContent),
    );
    expect(uniqueIds.size).toBe(bookmarks.length);
  });

  it('should render bookmarks with correct likeCounts', async () => {
    await renderWithProviders();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.queryByText(/150/)).not.toBeInTheDocument();
  });
});
