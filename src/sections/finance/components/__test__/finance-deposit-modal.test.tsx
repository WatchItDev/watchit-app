import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceDepositModal from "../finance-deposit-modal";

vi.mock("@src/hooks/use-auth.ts", () => ({
  useAuth: vi.fn(() => ({
    session: {
      address: "0x123456789abcdef",
    },
  })),
}));
vi.mock("@src/hooks/protocol/use-deposit.ts", () => ({
  useDeposit: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
}));

vi.mock("../finance-deposit", () => ({
  default: ({
    address,
    recipient,
    depositHook,
  }: {
    address: string;
    recipient: string;
    depositHook: {
      mutate: () => void;
      isLoading: boolean;
    };
  }) => (
    <div data-testid="FinanceDeposit">
      {address || "null"}-{recipient || "null"}-
      {depositHook && typeof depositHook.mutate === "function" ? "mockedDepositHook" : "noHook"}
    </div>
  ),
}));

const mockOnClose = vi.fn();
const mockOpen = true;

const renderComponent = () => {
  return render(<FinanceDepositModal open={mockOpen} onClose={mockOnClose} />);
};

describe("[COMPONENTS]: <FinanceDepositModal />", () => {
  it("to match snapshot", () => {
    renderComponent();
    expect(document.body).toMatchSnapshot();
  });
});
