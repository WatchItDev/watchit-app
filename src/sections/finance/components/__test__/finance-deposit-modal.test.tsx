import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

vi.mock("@src/sections/finance/components/finance-deposit-from-stripe", () => ({
  default: () => <div>Stripe Deposit</div>,
}));

vi.mock("@src/sections/finance/components/finance-deposit-from-metamask", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      Metamask Deposit
      <button onClick={onClose}>Close Metamask</button>
    </div>
  ),
}));

vi.mock("@src/sections/finance/components/finance-deposit-from-smart-account", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      Smart Account Deposit
      <button onClick={onClose}>Close Smart</button>
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

  it("renders modal title", () => {
    renderComponent();
    expect(screen.getByText("Deposit from")).toBeInTheDocument();
  });

  it("displays all deposit method tabs", () => {
    renderComponent();
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.getByText("Metamask")).toBeInTheDocument();
    expect(screen.getByText("Smart Account")).toBeInTheDocument();
  });

  it("renders Metamask content when clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Metamask"));
    expect(screen.getByText("Metamask Deposit")).toBeInTheDocument();
  });

  it("renders Smart Account content when clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Smart Account"));
    expect(screen.getByText("Smart Account Deposit")).toBeInTheDocument();
  });

  
});
