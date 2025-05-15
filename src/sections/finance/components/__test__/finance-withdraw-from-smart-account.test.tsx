import { describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceWithdrawFromSmartAccount from "../finance-withdraw-from-smart-account";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";
import { useAuth } from "@src/hooks/use-auth";

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

vi.mock("@src/hooks/use-auth.ts", () => ({
  useAuth: vi.fn(() => ({
    session: {
      address: "0x1111111111111111111111111111111111111111",
    },
  })),
}));
const mockWithdraw = vi.fn();

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

const renderComponent = ({ onClose = () => {} } = {}) => {
  const { container } = render(
    <Provider store={store}>
      <FinanceWithdrawFromSmartAccount onClose={onClose} />
    </Provider>,
  );
  return container;
};

describe("[COMPONENTS] <FinanceWithdrawFromSmartAccount/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should match snapshot", () => {
    const container = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render the component", () => {
    renderComponent();
    expect(screen.getByLabelText("Amount to withdraw")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
  });

  it("should display the wallet address", () => {
    renderComponent();
    expect(screen.getByText(/0x1111/)).toBeInTheDocument();
  });

  it("should call useAuth and useDeposit hooks", () => {
    renderComponent();
    expect(vi.mocked(useAuth)).toHaveBeenCalled();
  });
});
