import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FinanceTransactionsTableFiltersResult from "../finance-transactions-table-filters-result";

const mockFilters = {
  status: "all",
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

describe("[COMPONENTS] <FinanceTransactionsTableFiltersResult/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render with correct props", () => {
    renderComponent();
    expect(screen.getByText(`${mockResults}`)).toBeInTheDocument();
    expect(screen.getByText("results found")).toBeInTheDocument();
  });
  it('shows status filter chip if status is not "all"', () => {
    render(
      <FinanceTransactionsTableFiltersResult
        filters={{ status: "transferTo" }}
        onFilters={vi.fn()}
        onResetFilters={vi.fn()}
        results={10}
      />,
    );

    expect(screen.getByText("Incomes")).toBeInTheDocument();
  });

  it('does not show status chip if status is "all"', () => {
    render(
      <FinanceTransactionsTableFiltersResult
        filters={{ status: "all" }}
        onFilters={vi.fn()}
        onResetFilters={vi.fn()}
        results={10}
      />,
    );

    expect(screen.queryByText("All")).not.toBeInTheDocument();
  });


});
