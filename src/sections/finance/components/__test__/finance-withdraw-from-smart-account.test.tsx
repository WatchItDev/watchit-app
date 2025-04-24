import { describe, it, vi } from "vitest";
import { render } from "@testing-library/react";
import FinanceWithdrawFromSmartAccount from "../finance-withdraw-from-smart-account";
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
  useAuth: () => ({
    session: {
      address: "0x1111111111111111111111111111111111111111",
    },
  }),
}));

vi.mock("@src/hooks/protocol/use-withdraw.ts", () => ({
  useWithdraw: () => ({
    withdraw: vi.fn(),
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

const renderComponent = () => {
  const { container } = render(
    <Provider store={store}>
      <FinanceWithdrawFromSmartAccount onClose={() => {}} />
    </Provider>,
  );
  return container;
};

describe("[COMPONENTS] <FinanceWithdrawFromSmartAccount/>", () => {
  it("debería hacer match con el snapshot", () => {
    const container = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
