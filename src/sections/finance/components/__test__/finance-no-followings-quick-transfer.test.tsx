import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceNoFollowingsQuickTransfer from "../finance-no-followings-quick-transfer";

const renderComponent = () => {
  return render(<FinanceNoFollowingsQuickTransfer />);
};

describe("<COMPONENTS> FinanceNoFollowingsQuickTransfer ", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
