import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceTransactionTableRow from "../finance-transactions-table-row";
import { truncateAddress } from "@src/utils/wallet";

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
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    expect(screen.getByText(mockRow.message)).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(mockRow.name))).toBeInTheDocument();
  });
});
