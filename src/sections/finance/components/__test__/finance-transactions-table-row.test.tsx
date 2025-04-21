import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceTransactionTableRow from "../finance-transactions-table-row";

const mockRow = {
  date: BigInt("1234567890"),
  name: "Test User",
  amount: "100",
  avatarUrl: "https://example.com/avatar.jpg",
  message: "Test message",
  category: "income",
  id: "12345",
  type: "credit",
  status: "completed",
};

const renderComponent = (selected = false) =>
  render(<FinanceTransactionTableRow row={mockRow} selected={selected} />);

describe("[COMPONENTS] <FinanceTransactionTableRow/>", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render with correct props", () => {
    const { getByText } = renderComponent();
    expect(getByText("Test message")).toBeInTheDocument();
    expect(getByText("100 MMC")).toBeInTheDocument();
  });
});
