import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceMetamaskHelper from "../finance-metamask-helper";

describe("<COMPONENTS> FinanceMetamaskHelper", () => {
  it("to match snapshot", () => {
    const { container } = render(<FinanceMetamaskHelper />);
    expect(container).toMatchSnapshot();
  });
});
