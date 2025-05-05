import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceOverlayLoader from "../finance-overlay-loader";
import { COLORS } from "@src/layouts/config-layout";

describe("[COMPONENTS] <FinanceOverlayLoader/>", () => {
  it("to match snapshot", () => {
    const { container } = render(<FinanceOverlayLoader />);
    expect(container).toMatchSnapshot();
  });

  it("should render a Box with correct styles", () => {
    const { getByTestId } = render(<FinanceOverlayLoader />);
    const boxElement = getByTestId("loading-screen");
    expect(boxElement).toHaveStyle({
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: COLORS.GRAY_DARK,
      opacity: "0.7",
      zIndex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("should render the LoadingScreen component", () => {
    const { getByTestId } = render(<FinanceOverlayLoader />);
    const loadingScreen = getByTestId("loading-screen");
    expect(loadingScreen).toBeInTheDocument();
  });
});
