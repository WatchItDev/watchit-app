import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import FinanceMetamaskHelper from '../finance-metamask-helper';

describe('<COMPONENTS> FinanceMetamaskHelper', () => {
  it('to match snapshot', () => {
    const { container } = render(<FinanceMetamaskHelper />);
    expect(container).toMatchSnapshot();
  });

  it('renders Stack, Typography, and Link components', () => {
    render(<FinanceMetamaskHelper />);
    expect(screen.getByText(/MetaMask required/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Click here/i }),
    ).toBeInTheDocument();
  });

  it('Link has correct attributes', () => {
    render(<FinanceMetamaskHelper />);
    const link = screen.getByRole('link', { name: /Click here/i });
    expect(link).toHaveAttribute('href', 'https://metamask.app.link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });
  it('Link has correct styles', () => {
    render(<FinanceMetamaskHelper />);
    const link = screen.getByRole('link', { name: /Click here/i });
    expect(link).toHaveStyle('color: rgba(0, 0, 0, 0.87);');
  });

  it('calls handleDownloadMetaMask on click', () => {
    render(<FinanceMetamaskHelper />);
    const link = screen.getByRole('link', { name: /Click here/i });
    link.click();
    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
