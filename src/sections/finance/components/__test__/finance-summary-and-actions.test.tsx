import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@web3auth/auth", () => ({
  keccak256Padded: vi.fn(),
  mimcGetConstants: vi.fn(),
}));

vi.mock("ethereum-cryptography/utils.js", () => ({
  keccak256: vi.fn(() => new Uint8Array()),
}));

vi.mock("@src/sections/finance/components/finance-widget-summary", () => ({
  default: () => <div>Mocked FinanceWidgetSummary</div>,
}));
vi.mock("@src/sections/finance/components/finance-quick-transfer", () => ({
  default: () => <div>Mocked FinanceQuickTransfer</div>,
}));
vi.mock("@src/sections/finance/components/finance-earn-tokens", () => ({
  default: () => <div>Mocked FinanceEarnTokens</div>,
}));

vi.mock("@src/hooks/use-responsive.ts", () => ({
  useResponsive: vi.fn(() => true),
}));

import { SummaryAndActions } from "../finance-summary-and-actions";

const mockProps = {
  percent: 0,
  widgetSeriesData: [],
  balanceFromRedux: 0,
  following: undefined,
  loadingProfiles: false,
};

const renderComponent = (props = mockProps) => render(<SummaryAndActions {...props} />);

describe("[COMPONENTS] <FinanceSummaryAndActions/>", () => {
  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
