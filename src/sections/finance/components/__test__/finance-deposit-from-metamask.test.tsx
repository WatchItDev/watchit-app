import { describe, expect, it } from "vitest";
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
vi.mock("@src/hooks/use-metamask", () => ({
  useMetaMask: () => ({
    loading: true,
    account: null,
    connect: vi.fn(),
  }),
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
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("shows loader when loading is true", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("finance-metamask-loader")).toBeInTheDocument();
  });
});
