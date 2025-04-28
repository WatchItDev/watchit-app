import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { FinanceTabs } from "../finance-tabs";
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

vi.mock("@src/sections/finance/components/finance-balance-statistics.tsx", () => {
  return { default: () => <div>Mocked FinanceBalanceStatistics</div> };
});
vi.mock("@src/sections/finance/components/finance-transactions-history.tsx", () => {
  return { default: () => <div>Mocked FinanceTransactionsHistory</div> };
});

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <FinanceTabs />
    </Provider>,
  );
};

describe("[COMPONENTS] <FinanceTabs/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
