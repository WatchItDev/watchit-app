import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
