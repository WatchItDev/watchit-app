import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceTransactionTableRow from "../finance-transactions-table-row";
import { truncateAddress } from "@src/utils/wallet";
import { format } from "date-fns";
import { TX_COLORS } from "../../CONSTANTS";

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

  it("show the date and time formatted correctly", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const date = format(new Date(Number(mockRow.date) * 1000), "dd/MM/yyyy");
    const time = format(new Date(Number(mockRow.date) * 1000), "p");
    expect(screen.getByText(date)).toBeInTheDocument();
    expect(screen.getByText(time)).toBeInTheDocument();
  });

  it("Apply the correct color based on the type of transaction", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const amountElement = screen.getByText(/MMC/);
    const expectedColor = TX_COLORS[mockRow.type as keyof typeof TX_COLORS];
    expect(amountElement).toHaveStyle(`color: ${expectedColor}`);
  });

  it("Displays the avatar with the correct image and alt", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const avatar = screen.getByAltText((alt) => alt.toLowerCase() === mockRow.name.toLowerCase());
    expect(avatar).toHaveAttribute("src", mockRow.avatarUrl);
  });

  it("should not render incorrect message", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    expect(screen.queryByText("Incorrect message")).not.toBeInTheDocument();
  });

  it("should not render incorrect truncated name", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    expect(screen.queryByText(truncateAddress("Wrong User"))).not.toBeInTheDocument();
  });

  it("should not apply incorrect color for transaction type", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const amountElement = screen.getByText(/MMC/);
    const incorrectColor = "rgb(255, 0, 0)";
    expect(amountElement).not.toHaveStyle(`color: ${incorrectColor}`);
  });

  it("should not render incorrect date and time", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const incorrectDate = "01/01/2000";
    const incorrectTime = "12:00 AM";
    expect(screen.queryByText(incorrectDate)).not.toBeInTheDocument();
    expect(screen.queryByText(incorrectTime)).not.toBeInTheDocument();
  });
  it("should not render incorrect avatar", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    const incorrectAvatar = screen.queryByAltText("Incorrect Avatar");
    expect(incorrectAvatar).not.toBeInTheDocument();
  });
  it("should not render incorrect amount", () => {
    render(<FinanceTransactionTableRow row={mockRow} selected={false} />);
    expect(screen.queryByText(/200 MMC/)).not.toBeInTheDocument();
  });
});
