import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import FinanceWithdrawFromMetamask from "../finance-withdraw-from-metamask";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";

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

const connectMock = vi.fn();
let loading = false;
let account: string | undefined = "0x1111111111111111111111111111111111111111";

vi.mock("@src/hooks/use-metamask", () => ({
  useMetaMask: () => ({
    account,
    loading,
    connect: connectMock,
  }),
}));

const renderComponent = ({ onClose = () => {} } = {}) => {
  return render(
    <Provider store={store}>
      <FinanceWithdrawFromMetamask onClose={onClose} />
    </Provider>,
  );
};

describe("[COMPONENTS] <FinanceWithdrawFromMetamask/>", () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render loader while loading", () => {
    loading = true;
    account = undefined;

    const { getByTestId } = render(<FinanceWithdrawFromMetamask onClose={onCloseMock} />);
    expect(getByTestId("finance-metamask-loader")).toBeInTheDocument();
  });
});
