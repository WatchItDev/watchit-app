import { render, fireEvent } from '@testing-library/react';
import CopyableText from '@src/components/copyable-text/copyable-text';
import { Icon } from '@iconify/react';

const mockClipboard = {
  writeText: vi.fn(),
};
Object.defineProperty(navigator, 'clipboard', { value: mockClipboard });

vi.mock('@iconify/react', () => ({
  Icon: vi.fn(({ icon }) => <span data-testid="icon" data-icon={icon} />),
}));

vi.useFakeTimers();

describe('[COMPONENTS]: CopyableText component testing', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(
      <CopyableText label="Test Label" text="Test Text" />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders label correctly', () => {
    const { getByText } = render(
      <CopyableText label="Test Label" text="Test Text" />,
    );
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('copies text to clipboard when button is clicked', () => {
    const { getByRole } = render(
      <CopyableText label="Test Label" text="Text to copy" />,
    );
    const copyButton = getByRole('button');

    fireEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('Text to copy');
  });

  it('shows copy icon by default', () => {
    render(<CopyableText label="Test Label" text="Test Text" />);
    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'mdi:content-copy' }),
      expect.anything(),
    );
  });

  it('shows check icon after copying', () => {
    render(<CopyableText label="Test Label" text="Test Text" />);

    // @ts-expect-error No error in this context
    Icon.mockClear();

    const copyButton = document.querySelector('button');
    // @ts-expect-error No error in this context
    fireEvent.click(copyButton);

    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'mdi:check' }),
      expect.anything(),
    );
  });

  it('renders tooltip with correct copy text', () => {
    const { getByRole } = render(
      <CopyableText label="Test Label" text="Test Text" />,
    );
    const copyButton = getByRole('button');

    expect(copyButton).toHaveAttribute('aria-label', 'Copy');
  });

  it('updates tooltip text after copying', () => {
    const { getByRole } = render(
      <CopyableText label="Test Label" text="Test Text" />,
    );
    const copyButton = getByRole('button');

    fireEvent.click(copyButton);

    expect(copyButton).toHaveAttribute('aria-label', 'Copied!');
  });
});
