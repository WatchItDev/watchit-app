import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import FinanceTransactionsTableFiltersResult from '../finance-transactions-table-filters-result';

const mockFilters = {
  status: 'all',
};
const mockOnFilters = vi.fn();
const mockOnResetFilters = vi.fn();
const mockResults = 0;
const renderComponent = () =>
  render(
    <FinanceTransactionsTableFiltersResult
      filters={mockFilters}
      onFilters={mockOnFilters}
      onResetFilters={mockOnResetFilters}
      results={mockResults}
    />,
  );

describe('[COMPONENTS] <FinanceTransactionsTableFiltersResult/>', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('to match snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('should render with correct props', () => {
    renderComponent();
    expect(screen.getByText(`${mockResults}`)).toBeInTheDocument();
    expect(screen.getByText('results found')).toBeInTheDocument();
  });
  it('shows status filter chip if status is not "all"', () => {
    render(
      <FinanceTransactionsTableFiltersResult
        filters={{ status: 'transferTo' }}
        onFilters={vi.fn()}
        onResetFilters={vi.fn()}
        results={10}
      />,
    );

    expect(screen.getByText('Incomes')).toBeInTheDocument();
  });

  it('does not show status chip if status is "all"', () => {
    render(
      <FinanceTransactionsTableFiltersResult
        filters={{ status: 'all' }}
        onFilters={vi.fn()}
        onResetFilters={vi.fn()}
        results={10}
      />,
    );

    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });

  it('should call onResetFilters when reset button is clicked', () => {
    renderComponent();
    const resetButton = screen.getByText('Clear');
    fireEvent.click(resetButton);
    expect(mockOnResetFilters).toHaveBeenCalled();
  });

  test('should call onFilters with "status" and "all" when chip delete is clicked', () => {
    const onFilters = vi.fn();
    const onResetFilters = vi.fn();

    render(
      <FinanceTransactionsTableFiltersResult
        filters={{ status: 'transferTo' }}
        onFilters={onFilters}
        onResetFilters={onResetFilters}
        results={10}
      />,
    );

    const chip = screen.getByText('Incomes').closest('div');
    const deleteIcon = within(chip!).getByTestId('CancelIcon');

    fireEvent.click(deleteIcon);

    expect(onFilters).toHaveBeenCalledWith('status', 'all');
  });
});
