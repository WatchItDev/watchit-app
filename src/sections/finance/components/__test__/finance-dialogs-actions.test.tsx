import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FinanceDialogsActions from "../finance-dialogs-actions";

const onConfirm = vi.fn();

const mockRainbow = ({ children }: any) => <div data-testid="mock-rainbow">{children}</div>;

const defaultProps = {
  rainbowComponent: mockRainbow,
  loading: false,
  actionLoading: false,
  amount: 0,
  balance: 0,
  label: "Confirmar",
  onConfirmAction: onConfirm,
};

const renderComponent = (props = {}) => {
  return render(<FinanceDialogsActions {...defaultProps} {...props} />);
};

describe("[COMPONENTS]: <FinanceDialogsActions />", () => {
  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render label correctly", () => {
    renderComponent({ label: "Aceptar" });
    expect(screen.getByRole("button")).toHaveTextContent("Aceptar");
  });

  it("should render custom rainbow component", () => {
    renderComponent();
    expect(screen.getByTestId("mock-rainbow")).toBeInTheDocument();
  });

  it("should disable button if amount is 0", () => {
    renderComponent({ amount: 0, balance: 100 });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should disable button if amount is greater than balance", () => {
    renderComponent({ amount: 150, balance: 100 });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should enable button when conditions are met", () => {
    renderComponent({ amount: 50, balance: 100 });
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("should call onConfirmAction when button is clicked", () => {
    renderComponent({ amount: 50, balance: 100 });
    fireEvent.click(screen.getByRole("button"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("should show loading state when loading is true", () => {
    renderComponent({ loading: true, amount: 10, balance: 100 });
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
  });
});
