import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FinanceMetamaskLoader from "../finance-metamask-loader";

describe("<COMPONENTS> FinanceMetamaskLoader", () => {
  it("to match snapshot", () => {
    const { container } = render(<FinanceMetamaskLoader />);
    expect(container).toMatchSnapshot();
  });

  it("should render the LoadingScreen component", () => {
    render(<FinanceMetamaskLoader />);
    const loadingScreen = screen.getByTestId("finance-metamask-loader");
    expect(loadingScreen).toBeInTheDocument();
  });

  it("should apply correct Box styles", () => {
    const { container } = render(<FinanceMetamaskLoader />);
    const boxElement = container.querySelector("div");
    expect(boxElement).toHaveStyle("margin-left: 32px");
    expect(boxElement).toHaveStyle("margin-right: 32px");
    expect(boxElement).toHaveStyle("margin-top: 64px");
    expect(boxElement).toHaveStyle("margin-bottom: 64px");
  });
});
