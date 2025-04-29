import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceOverlayLoader from "../finance-overlay-loader";

describe("[COMPONENTS] <FinanceOverlayLoader/>", () => {
  it("to match snapshot", () => {
    const { container } = render(<FinanceOverlayLoader />);
    expect(container).toMatchSnapshot();
  });
});
