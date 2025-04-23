import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FinanceDepositFromSmartAccount from "../finance-deposit-from-smart-account";

type DepositHook = {
  mutate: () => void;
  isLoading: boolean;
};

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
  default: ({
    address,
    recipient,
    depositHook,
  }: {
    address: string;
    recipient: string;
    depositHook: DepositHook;
  }) => (
    <div data-testid="FinanceDeposit">
      {address}-{recipient}-
      {depositHook && typeof depositHook.mutate === "function" ? "mockedDepositHook" : "noHook"}
    </div>
  ),
}));

const mockOnClose = vi.fn();
const renderComponent = () => render(<FinanceDepositFromSmartAccount onClose={mockOnClose} />);

describe("FinanceDepositFromSmartAccount", () => {
  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should pass correct props to FinanceDeposit", () => {
    const { getByTestId } = renderComponent();
    const content = getByTestId("FinanceDeposit").textContent;

    expect(content).toContain("0x123456789abcdef");
    expect(content).toContain("0x123456789abcdef");
    expect(content).toContain("mockedDepositHook");
  });
});
