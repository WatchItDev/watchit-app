import { render, screen } from '@testing-library/react';
import BreadcrumbsLink from '../link-item';

// Mock the RouterLink component
vi.mock('@src/routes/components', () => {
  const React = require('react');
  return {
    // @ts-expect-error No error in this context
    RouterLink: React.forwardRef(({ href, children, ...props }, ref) => (
      <a href={href} ref={ref} data-testid="router-link" {...props}>
        {children}
      </a>
    )),
  };
});

describe('[COMPONENTS]: BreadcrumbsLink component testing', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard', href: '/dashboard' }}
        disabled={false}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('passes proper props to RouterLink component', () => {
    render(
      <BreadcrumbsLink
        link={{ name: 'Settings', href: '/settings' }}
        disabled={false}
      />,
    );

    const link = screen.getByTestId('router-link');
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveStyle('color: rgba(0, 0, 0, 0.87)'); // text.primary
  });

  it('renders link with href using RouterLink component', () => {
    render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard', href: '/dashboard' }}
        disabled={false}
      />,
    );

    const link = screen.getByTestId('router-link');
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveTextContent('Dashboard');
  });

  it('renders as Box component when no href is provided', () => {
    render(<BreadcrumbsLink link={{ name: 'Dashboard' }} disabled={false} />);

    expect(screen.queryByTestId('router-link')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard', icon: <TestIcon /> }}
        disabled={false}
      />,
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies disabled styles when disabled is true and activeLast is false', () => {
    const { container } = render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard' }}
        disabled={true}
        activeLast={false}
      />,
    );

    const element = container.firstChild;
    expect(element).toHaveStyle('pointer-events: none');
    expect(element).toHaveStyle('cursor: default');
  });

  it('does not apply disabled styles when disabled is true but activeLast is true', () => {
    const { container } = render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard' }}
        disabled={true}
        activeLast={true}
      />,
    );

    const element = container.firstChild;
    expect(element).not.toHaveStyle('pointer-events: none');
  });

  it('displays name correctly', () => {
    render(
      <BreadcrumbsLink
        link={{ name: 'Very Long Dashboard Name' }}
        disabled={false}
      />,
    );

    expect(screen.getByText('Very Long Dashboard Name')).toBeInTheDocument();
  });

  it('renders icon with correct margin styling', () => {
    const TestIcon = () => <svg data-testid="svg-icon" />;

    const { container } = render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard', icon: <TestIcon /> }}
        disabled={false}
      />,
    );

    const iconContainer = container.querySelector('span');
    expect(iconContainer).toHaveStyle('margin-right: 8px');
  });

  it('handles empty name gracefully', () => {
    render(<BreadcrumbsLink link={{ name: '' }} disabled={false} />);

    expect(document.body).toContainHTML('<div');
  });

  it('renders RouterLink with proper ref handling', () => {
    render(
      <BreadcrumbsLink
        link={{ name: 'Dashboard', href: '/dashboard' }}
        disabled={false}
      />,
    );

    const link = screen.getByTestId('router-link');
    expect(link).toBeInTheDocument();
  });
});
