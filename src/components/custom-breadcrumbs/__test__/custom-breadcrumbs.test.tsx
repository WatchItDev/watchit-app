import { render, screen } from '@testing-library/react';
import CustomBreadcrumbs from '../custom-breadcrumbs';
import LinkItem from '../link-item';
import { afterEach } from 'vitest';

// Mock LinkItem component to simplify testing
vi.mock('../link-item', () => ({
  default: vi.fn(({ link, activeLast, disabled }) => (
    <div
      data-testid="link-item"
      data-link={link.name}
      data-active-last={activeLast}
      data-disabled={disabled}
    >
      {link.name}
    </div>
  )),
}));

describe('[COMPONENTS]: CustomBreadcrumbs component testing', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('to match snapshot', () => {
    const { baseElement } = render(
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Dashboard', href: '/dashboard' },
        ]}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
  it('does not render breadcrumbs when links array is empty', () => {
    render(<CustomBreadcrumbs links={[]} heading="Page Title" />);

    expect(LinkItem).not.toHaveBeenCalled();
  });

  it('renders heading when provided', () => {
    render(
      <CustomBreadcrumbs
        heading="Page Title"
        links={[{ name: 'Home', href: '/' }]}
      />,
    );
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('renders breadcrumbs from links array', () => {
    render(
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Dashboard', href: '/dashboard' },
        ]}
      />,
    );

    /*expect(LinkItem).toHaveBeenCalledTimes(2);*/
    expect(screen.getAllByTestId('link-item')).toHaveLength(2);
  });

  it('marks the last link as disabled', () => {
    render(
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Dashboard', href: '/dashboard' },
        ]}
      />,
    );

    const linkItems = screen.getAllByTestId('link-item');
    expect(linkItems[0]).toHaveAttribute('data-disabled', 'false');
    expect(linkItems[1]).toHaveAttribute('data-disabled', 'true');
  });

  it('renders action element when provided', () => {
    render(
      <CustomBreadcrumbs
        links={[{ name: 'Home', href: '/' }]}
        action={<button>Action Button</button>}
      />,
    );

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('renders additional links from moreLink', () => {
    render(
      <CustomBreadcrumbs
        links={[{ name: 'Home', href: '/' }]}
        moreLink={['https://example.com/docs', 'https://example.com/help']}
      />,
    );

    expect(screen.getByText('https://example.com/docs')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/help')).toBeInTheDocument();
  });

  it('does not render heading when not provided', () => {
    render(<CustomBreadcrumbs links={[{ name: 'Home', href: '/' }]} />);

    const headings = screen.queryAllByRole('heading');
    expect(headings.length).toBe(0);
  });

  it('does not render moreLink section when not provided', () => {
    const { container } = render(
      <CustomBreadcrumbs links={[{ name: 'Home', href: '/' }]} />,
    );

    // Check that there are no links other than those in the breadcrumbs
    const links = container.querySelectorAll('a[href]');
    expect(links.length).toBe(0);
  });

  it('passes custom sx prop to container', () => {
    const { container } = render(
      <CustomBreadcrumbs
        links={[{ name: 'Home', href: '/' }]}
        sx={{ padding: '20px' }}
      />,
    );

    const box = container.firstChild;
    expect(box).toHaveStyle('padding: 20px');
  });
});
