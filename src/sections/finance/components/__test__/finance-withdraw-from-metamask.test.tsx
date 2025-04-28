import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import FinanceWithdrawFromMetamask from "../finance-withdraw-from-metamask";

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

describe("[COMPONENTS] <FinanceWithdrawFromMetamask/>", () => {
  const onCloseMock = vi.fn();

  it("should match snapshot", () => {
    const { container } = render(<FinanceWithdrawFromMetamask onClose={onCloseMock} />);
    expect(container).toMatchSnapshot();
  });
});
