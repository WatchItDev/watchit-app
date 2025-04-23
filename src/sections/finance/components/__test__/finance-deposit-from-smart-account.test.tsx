import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FinanceDepositFromSmartAccount from "../finance-deposit-from-smart-account";

vi.mock("@src/hooks/use-auth.ts", () => ({
  useAuth: () => ({
    session: {
      address: "0x123456789abcdef",
    },
  }),
}));

vi.mock("@src/hooks/protocol/use-deposit.ts", () => ({
  useDeposit: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock("../finance-deposit", () => ({
  default: () => <div data-testid="FinanceDeposit">Mocked FinanceDeposit</div>,
}));

const mockOnClose = vi.fn();
const renderComponent = () => render(<FinanceDepositFromSmartAccount onClose={mockOnClose} />);

describe("FinanceDepositFromSmartAccount", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
