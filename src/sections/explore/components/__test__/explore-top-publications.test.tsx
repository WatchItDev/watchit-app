import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@src/redux/store";
import { ExploreTopPublications } from "../explore-top-publications";

vi.mock("@src/workers/backgroundTaskWorker?worker", () => {
  return {
    default: class {
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    },
  };
});
vi.mock("@lens-protocol/react-web", () => import("../__test__/__mocks__/lens-protocol-react-web"));

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ExploreTopPublications />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Testing in the <ExploreTopPublications/> component", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();

    screen.debug(container);
  });

  // it("should render the component with content", () => {
  //   renderWithProviders();
  //   expect(screen.getByText("Título de prueba")).toBeInTheDocument();
  //   expect(screen.getByText("Contenido de prueba para explorar publicaciones")).toBeInTheDocument();
  // });
});
