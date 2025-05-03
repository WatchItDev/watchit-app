import { render, screen, fireEvent } from '@testing-library/react';
import TablePaginationCustom from '../table-pagination-custom';

describe('[COMPONENTS]: TablePaginationCustom component testing', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with default rowsPerPageOptions', () => {
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
      />
    );

    const selectElement = screen.getByRole('combobox', { name: /rows per page/i });
    expect(selectElement).toBeInTheDocument();
  });

  it('does not display dense switch when onChangeDense is not provided', () => {
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
      />
    );

    expect(screen.queryByText('Dense')).not.toBeInTheDocument();
  });

  it('displays dense switch when onChangeDense is provided', () => {
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        dense={false}
        onChangeDense={() => {}}
      />
    );

    expect(screen.getByText('Dense')).toBeInTheDocument();
  });

  it('calls onChangeDense when dense switch is clicked', async () => {
    const handleChangeDense = vi.fn();

    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        dense={false}
        onChangeDense={handleChangeDense}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Dense' }));
    expect(handleChangeDense).toHaveBeenCalled();
  });

  it('applies custom sx prop to container', () => {
    const { container } = render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        sx={{ backgroundColor: 'rgb(240, 240, 240)' }}
      />
    );

    const boxContainer = container.firstChild;
    expect(boxContainer).toHaveStyle('background-color: rgb(240, 240, 240)');
  });

  it('renders with custom rowsPerPageOptions', () => {
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={20}
        onPageChange={() => {}}
        rowsPerPageOptions={[20, 40, 60]}
      />
    );

    expect(screen.getByText('1–20 of 100')).toBeInTheDocument();
  });

  it('calls onPageChange when page is changed', async () => {
    const handlePageChange = vi.fn();
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(handlePageChange).toHaveBeenCalled();
  });

  it('correctly displays when dense is true', () => {
    render(
      <TablePaginationCustom
        count={100}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        dense={true}
        onChangeDense={() => {}}
      />
    );

    const denseSwitch = screen.getByRole('checkbox', { name: 'Dense' });
    expect(denseSwitch).toBeChecked();
  });
});
