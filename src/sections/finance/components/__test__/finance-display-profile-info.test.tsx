import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import FinanceDisplayProfileInfo from "../finance-display-profile-info";
import { Profile } from "@lens-protocol/api-bindings";


const carouselMock = {
  currentIndex: 0,
  nav: undefined,
  carouselSettings: {},
  carouselRef: { current: null },
  onPrev: () => {},
  onNext: () => {},
  onSetNav: () => {},
  onTogo: () => {},
  setNav: () => {},
  setCurrentIndex: () => {},
};
const initialListMock: Profile[] = [];

const renderComponent = () => {
  return render(
    <FinanceDisplayProfileInfo
      initialList={initialListMock}
      carousel={carouselMock}
      mode="profile"
    />,
  );
};
describe("[COPONENTS]: <FinanceDisplayProfileInfo />", () => {
  it("to match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
