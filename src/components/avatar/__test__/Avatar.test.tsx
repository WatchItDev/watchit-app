import { describe, it, expect, vi } from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react'
import AvatarProfile from '@src/components/avatar/avatar.tsx';

describe('[COMPONENTS]: AvatarProfile component testing', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(<AvatarProfile src="test-src" />);
    expect(baseElement).toMatchSnapshot();
  });

  it('renders with default props', () => {
    render(<AvatarProfile src="test" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt', 'Avatar profile');
  });

  it('uses dicebear when src is not a URL', () => {
    render(<AvatarProfile src="test" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src');
    expect(avatar.getAttribute('src')).toContain('api.dicebear.com');
  });

  it('renders avatar with direct URL when src starts with http', () => {
    render(<AvatarProfile src="https://example.com/avatar.png" data-testid="avatar" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('renders avatar with direct URL when src starts with blob', () => {
    render(<AvatarProfile src="blob:https://example.com/avatar" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'blob:https://example.com/avatar');
  });

  it('sets alt text to uppercase when provided', () => {
    render(<AvatarProfile src="test-src" alt="user" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('alt', 'USER');
  });

  it('sets default alt text when not provided', () => {
    render(<AvatarProfile src="test-src" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('alt', 'Avatar profile');
  });

  it('sets custom alt text when provided', () => {
    render(<AvatarProfile alt='Custom' src="test-src" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('alt', 'CUSTOM');
  });

  it('applies default styles correctly', () => {
    render(<AvatarProfile src="test-src" data-testid="avatar" />);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('applies additional styles when provided via sx prop', () => {
    render(<AvatarProfile src="test-src" sx={{ width: 60, height: 60 }} data-testid="avatar" />);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('handles click events correctly', async () => {
    const handleClick = vi.fn();
    render(<AvatarProfile src="test-src" onClick={handleClick} data-testid="avatar" />);
    const avatar = screen.getByTestId('avatar');

    fireEvent.click(avatar);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant correctly', () => {
    render(<AvatarProfile src="test-src" variant="square" data-testid="avatar" />);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('MuiAvatar-square');
  });
});
