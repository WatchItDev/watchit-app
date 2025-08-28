import { render, screen } from '@testing-library/react';
import TableNoData from '../table-no-data';

describe('[COMPONENTS]: TableNoData component testing', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <TableNoData loading={false} notFound={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays loading text when loading is true and notFound is true', () => {
    render(<TableNoData loading={true} notFound={true} />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('displays default empty text when notFound is true and loading is false', () => {
    render(<TableNoData loading={false} notFound={true} />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('displays custom empty text when provided', () => {
    render(
      <TableNoData
        loading={false}
        notFound={true}
        emptyText="Custom empty message"
      />,
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('renders empty cell when notFound is false', () => {
    const { container } = render(
      <TableNoData loading={false} notFound={false} />,
    );

    const tableCell = container.querySelector('td');
    if (tableCell) {
      expect(tableCell).toBeInTheDocument();
      expect(tableCell.textContent).toBe('');
    }
  });

  it('sets colSpan to 12 on TableCell', () => {
    const { container } = render(
      <TableNoData loading={false} notFound={true} />,
    );

    const tableCell = container.querySelector('td');
    expect(tableCell).toHaveAttribute('colspan', '12');
  });
});
