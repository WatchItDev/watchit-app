import { describe, expect, it, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import FinanceDepositFromMetamask from "../finance-deposit-from-metamask";
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

vi.mock("@src/hooks/protocol/use-get-mmc-contract-balance", () => ({
  useGetMmcContractBalance: () => ({
    balance: BigInt(1000),
    isLoading: false,
    error: null,
  }),
}));

const mockMetaMaskState: { loading: boolean; account: string | null } = {
  loading: true,
  account: null,
};

vi.mock("@src/hooks/use-metamask", () => ({
  useMetaMask: () => mockMetaMaskState,
}));

const mockAuthState: { session: null | { address: string | null } } = {
  session: null,
};

vi.mock("@src/hooks/use-auth", () => ({
  useAuth: () => mockAuthState,
}));

const renderComponent = () => {
  const onClose = vi.fn();
  return render(
    <Provider store={store}>
      <FinanceDepositFromMetamask onClose={onClose} />
    </Provider>,
  );
};

describe("<COMPONENTS> FinanceDepositFromMetamask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMetaMaskState.loading = true;
    mockMetaMaskState.account = null;
    mockAuthState.session = null;
  });

  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("shows loader when loading is true", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("finance-metamask-loader")).toBeInTheDocument();
  });

  it("shows connect button when loading is false and account is null", () => {
    mockMetaMaskState.loading = false;
    mockMetaMaskState.account = null;

    const { getByTestId } = renderComponent();
    expect(getByTestId("finance-metamask-button")).toBeInTheDocument();
  });

  it("handles missing session.address gracefully", () => {
    mockMetaMaskState.loading = false;
    mockMetaMaskState.account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
    mockAuthState.session = { address: null };

    const { container } = renderComponent();

    expect(container.querySelector('[data-testid="finance-metamask-loader"]')).toBeFalsy();
    expect(container.querySelector('[data-testid="finance-metamask-button"]')).toBeFalsy();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("shows FinanceDeposit when account is connected", () => {
    mockMetaMaskState.loading = false;
    mockMetaMaskState.account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
    mockAuthState.session = { address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" };

    const { getByText } = renderComponent();
    expect(getByText("Connected Wallet")).toBeInTheDocument();
  });

  it("calls connect on button click", () => {
    mockMetaMaskState.loading = false;
    mockMetaMaskState.account = null;

    const { getByTestId } = renderComponent();
    const button = getByTestId("finance-metamask-button");
    button.click();

    expect(mockMetaMaskState.loading).toBe(false);
  });
});
