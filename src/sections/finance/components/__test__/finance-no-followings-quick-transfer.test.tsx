import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceNoFollowingsQuickTransfer from "../finance-no-followings-quick-transfer";

const renderComponent = () => {
  return render(<FinanceNoFollowingsQuickTransfer />);
};

describe("<COMPONENTS> FinanceNoFollowingsQuickTransfer ", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("should render the correct message when there are no followings", () => {
    renderComponent();
    expect(screen.getByText(/Here appear your followings/i)).toBeInTheDocument();
    expect(screen.getByText(/Perform a search to start a transfer/i)).toBeInTheDocument();
    const orElements = screen.getAllByText(/OR/i);
    expect(orElements.length).toBeGreaterThan(0);
  });
  it("should render the correct structure of elements", () => {
    renderComponent();
    expect(screen.getByText(/Here appear your followings/i)).toBeInTheDocument();
    expect(screen.getByText(/Perform a search to start a transfer/i)).toBeInTheDocument();
    const orElements = screen.getAllByText(/OR/i);
    const orBox = orElements[0].closest("div");
    expect(orBox).toHaveStyle("position: absolute");
    expect(orBox).toHaveStyle("border-top: 1px dashed");
  });
  it("should have the correct color for the OR text", () => {
    renderComponent();
    const orElements = screen.getAllByText(/OR/i);
    const orBox = orElements[0].closest("div");
    expect(orBox).toHaveStyle("color: text.secondary");
  });
});
