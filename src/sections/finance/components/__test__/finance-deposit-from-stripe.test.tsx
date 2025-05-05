import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FinanceDepositFromStripe from "../finance-deposit-from-stripe";

describe("[COMPONENTS] <FinanceDepositFromStripe /> ", () => {
  it("to match snapshot", () => {
    const { container } = render(<FinanceDepositFromStripe />);
    expect(container).toMatchSnapshot();
  });
});
