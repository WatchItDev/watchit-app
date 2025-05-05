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

const mockMetaMaskState = {
  loading: true,
  account: null,
  connect: vi.fn(),
};

vi.mock("@src/hooks/use-metamask", () => ({
  useMetaMask: () => mockMetaMaskState,
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
});
