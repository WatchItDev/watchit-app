import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceTransactionTableRow from "../finance-transactions-table-row";

describe("[COMPONENTS] <FinanceTransactionTableRow/>", () => {
  it("to match snapshot", () => {
    const { container } = render(
      <FinanceTransactionTableRow
        row={{
          date: BigInt("1234567890"),
          name: "Test User",
          amount: "100",
          avatarUrl: "https://example.com/avatar.jpg",
          message: "Test message",
          category: "income",
          id: "12345",
          type: "credit",
          status: "completed",
        }}
        selected={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
