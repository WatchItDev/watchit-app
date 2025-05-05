import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FinanceDialogsActions from "../finance-dialogs-actions";

const mockProps = {
  rainbowComponent: undefined,
  loading: false,
  actionLoading: false,
  amount: 0,
  balance: 0,
  label: "",
};
const onConfirm = vi.fn();

const renderComponent = () => {
  return render(
    <FinanceDialogsActions
      onConfirmAction={onConfirm}
      {...mockProps}
      rainbowComponent={() => <div>Mocked Rainbow Component</div>}
    />,
  );
};

describe("<COMPONENTS> FinanceDialogsActions", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
