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
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });

  it("should render with correct icon", () => {
    renderComponent();
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", mockProps.icon);
  });

  it("should render with correct color", () => {
    renderComponent();
    const icon = screen.getByTestId("icon");
    expect(icon.getAttribute("data-icon")).toBe(mockProps.icon);
  });

  it("should fail if title is missing", () => {
    const { title, ...propsWithoutTitle } = mockProps;
    renderComponent(propsWithoutTitle as typeof mockProps);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("should fail if value is missing", () => {
    const { value, ...propsWithoutValue } = mockProps;
    renderComponent(propsWithoutValue as typeof mockProps);
    expect(screen.queryByText(`${value} MMC`)).not.toBeInTheDocument();
  });

  it("should fail if color is invalid", () => {
    const invalidColorProps = { ...mockProps, color: "invalid-color" };
    renderComponent(invalidColorProps);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle("color: invalid-color");
  });
});
