import { fireEvent, render, screen } from '@testing-library/react';
import TableHeadCustom from '../table-head-custom';
import { HeadLabel } from '@src/components/table';

describe('[COMPONENTS]: TableHeadCustom component testing', () => {
  const mockHeadLabels: HeadLabel[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email', align: 'center', width: 200 },
    { id: 'role', label: 'Role', align: 'right', minWidth: 150 },
  ];

  it('matches snapshot', () => {
    const { container } = render(
      <TableHeadCustom headLabel={mockHeadLabels} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with column headers correctly', () => {
    render(<TableHeadCustom headLabel={mockHeadLabels} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders without checkbox when onSelectAllRows is not provided', () => {
    const { container } = render(
      <TableHeadCustom headLabel={mockHeadLabels} />,
    );

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(0);
  });

  it('renders with checkbox when onSelectAllRows is provided', () => {
    const mockSelectAllRows = vi.fn();

    render(
      <TableHeadCustom
        headLabel={mockHeadLabels}
        onSelectAllRows={mockSelectAllRows}
        rowCount={5}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('calls onSelectAllRows when checkbox is clicked', async () => {
    const mockSelectAllRows = vi.fn();

    render(
      <TableHeadCustom
        headLabel={mockHeadLabels}
        onSelectAllRows={mockSelectAllRows}
        rowCount={5}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(mockSelectAllRows).toHaveBeenCalledWith(true);
  });

  it('shows checked checkbox when all rows are selected', () => {
    const mockSelectAllRows = vi.fn();

    render(
      <TableHeadCustom
        headLabel={mockHeadLabels}
        onSelectAllRows={mockSelectAllRows}
        rowCount={5}
        numSelected={5}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('renders sort labels when onSort is provided', () => {
    const mockOnSort = vi.fn();

    render(<TableHeadCustom headLabel={mockHeadLabels} onSort={mockOnSort} />);

    const sortLabels = screen.getAllByRole('button');
    expect(sortLabels).toHaveLength(3);
  });

  it('displays sort direction text for screen readers', () => {
    const mockOnSort = vi.fn();

    render(
      <TableHeadCustom
        headLabel={mockHeadLabels}
        onSort={mockOnSort}
        order="asc"
        orderBy="name"
      />,
    );

    expect(screen.getByText('sorted ascending')).toBeInTheDocument();
  });

  it('handles zero row count correctly', () => {
    const mockSelectAllRows = vi.fn();

    render(
      <TableHeadCustom
        headLabel={mockHeadLabels}
        onSelectAllRows={mockSelectAllRows}
        rowCount={0}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('applies custom sx to TableHead', () => {
    const customSx = { backgroundColor: 'rgb(240, 240, 240)' };

    const { container } = render(
      <TableHeadCustom headLabel={mockHeadLabels} sx={customSx} />,
    );

    const tableHead = container.querySelector('thead');
    expect(tableHead).toHaveStyle('background-color: rgb(240, 240, 240)');
  });
});
