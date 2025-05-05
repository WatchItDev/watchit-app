import { describe, expect, it } from "vitest";
import { render} from "@testing-library/react";
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
});
