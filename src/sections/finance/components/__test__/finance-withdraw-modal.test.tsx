import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FinanceWithdrawModal from "../finance-withdraw-modal";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";

vi.mock("@src/hooks/use-auth.ts", () => ({
  useAuth: vi.fn(() => ({
    session: {
      address: "0x1111111111111111111111111111111111111111",
    },
  })),
}));

const mockWithdraw = vi.fn();

vi.mock("@src/workers/backgroundTaskWorker?worker", () => {
  return {
    default: class {
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    },
  };
});

vi.mock("@src/hooks/protocol/use-withdraw.ts", () => ({
  useWithdraw: () => ({
    withdraw: mockWithdraw,
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@src/hooks/protocol/use-get-vault-balance.ts", () => ({
  useGetVaultBalance: () => ({
    data: 1000n,
    isLoading: false,
    error: null,
  }),
}));
const mockOnClose = vi.fn();
const renderComponent = (open = true) =>
  render(
    <Provider store={store}>
      <FinanceWithdrawModal open={open} onClose={mockOnClose} />
    </Provider>,
  );

describe("[COMPONENTS] <FinanceWithdrawModal/> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should not render modal if open is false", () => {
    renderComponent(false);
    expect(screen.queryByTestId("finance-withdraw-modal")).not.toBeInTheDocument();
  });

  it("should render modal if open is true", () => {
    renderComponent();
    expect(screen.getByTestId("finance-withdraw-modal")).toBeInTheDocument();
  });

  it("should render tabs correctly", () => {
    renderComponent();
    expect(screen.getByText("Metamask")).toBeInTheDocument();
    expect(screen.getByText("Smart Account")).toBeInTheDocument();
  });

  it("should change content when switching tabs", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Smart Account"));
    expect(screen.getByText("Smart Account")).toBeInTheDocument();
    expect(screen.getByTestId("FinanceWithdraw")).toBeInTheDocument();
    screen.debug();
  });
});
