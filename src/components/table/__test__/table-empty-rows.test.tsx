import { render } from '@testing-library/react';
import TableEmptyRows from '../table-empty-rows';

describe('[COMPONENTS]: TableEmptyRows component testing', () => {
  it('to match snapshot', () => {
    const { container } = render(<TableEmptyRows emptyRows={3} height={50} />);
    expect(container).toMatchSnapshot();
  });

  it('renders a TableRow when emptyRows is positive', () => {
    const { container } = render(<TableEmptyRows emptyRows={2} />);
    const tableRow = container.querySelector('tr');
    expect(tableRow).toBeInTheDocument();
  });

  it('applies height style when height prop is provided', () => {
    const { container } = render(<TableEmptyRows emptyRows={2} height={40} />);
    const tableRow = container.querySelector('tr');
    expect(tableRow).toHaveStyle('height: 80px');
  });

  it('returns null when emptyRows is 0', () => {
    const { container } = render(<TableEmptyRows emptyRows={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('creates TableCell with colspan of 9', () => {
    const { container } = render(<TableEmptyRows emptyRows={1} />);
    const tableCell = container.querySelector('td');
    expect(tableCell).toHaveAttribute('colspan', '9');
  });

  it('handles negative emptyRows by rendering a row', () => {
    const { container } = render(<TableEmptyRows emptyRows={-1} />);
    const tableRow = container.querySelector('tr');
    expect(tableRow).toBeInTheDocument();
  });

  it('does not apply calculated height style when height prop is not provided', () => {
    const { container } = render(<TableEmptyRows emptyRows={3} />);
    const tableRow = container.querySelector('tr');
    expect(tableRow).not.toHaveAttribute(
      'style',
      expect.stringContaining('height'),
    );
  });
});
