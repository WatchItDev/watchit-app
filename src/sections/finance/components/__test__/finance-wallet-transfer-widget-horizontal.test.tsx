import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceWalletTransferWidgetHorizontal from "../finance-wallet-transfer-widget-horizontal";

const mockProps = {
  icon: "icon-name",
  title: "Test Title",
  value: 100,
  color: "red",
};

const renderComponent = (props = mockProps) =>
  render(<FinanceWalletTransferWidgetHorizontal {...props} />);

describe("[COMPONENTS] <FinanceWalletTransferWidgetHorizontal/>", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render with correct props", () => {
    renderComponent();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockProps.value} MMC`)).toBeInTheDocument();
  });
});
