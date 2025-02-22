import React from 'react';
import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '@redux/reducer';
import {LensProvider, staging} from '@lens-protocol/react-web';
import {bindings} from "@src/auth/context/web3Auth/config/bindings.ts";

const store = createStore(rootReducer);

const lensConfig = {
  environment: staging,
  bindings: bindings,
  sharedDependencies: {
    pollingInterval: 5000,
  },
};


export namespace Testing {

  /**
   * Renders a React component with Redux store and React Router context for testing.
   *
   * This utility function wraps the provided React element (`ui`) with the Redux `Provider`
   * and React Router's `Router` components. It ensures that the component being tested has
   * access to the Redux store and React Router functionality, including routing-related
   * props and context.
   *
   * The `Router` uses specific future features:
   * - `v7_relativeSplatPath`: Enables relative splat matching in Router v7.
   * - `v7_startTransition`: Enables automatic start transition support in Router v7.
   *
   * @param {React.ReactElement} ui - The React element to be rendered for testing.
   * @returns {RenderResult} The result of rendering the React component, as provided by the
   *          `@testing-library/react` `render` function.
   */
  export const renderWithStoreAndRouter = (ui: React.ReactElement) => {
    return render(
      <ReduxProvider store={store}>
        <Router future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}>
          {ui}
        </Router>
      </ReduxProvider>
    );
  };

  /**
   * A utility function to render a React component wrapped with the necessary providers.
   * This includes the `LensProvider` for lens configurations, a Redux `Provider` for store management,
   * and a `Router` configured with specific future flags.
   *
   * @param {React.ReactElement} ui - The React component to be rendered.
   * @returns {RenderResult} The result of rendering the component with the specified providers.
   */
  export const renderWithLensProvider = (ui: React.ReactElement) => {
    return render(
      <LensProvider config={lensConfig}>
        <ReduxProvider store={store}>
          <Router future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}>
            {ui}
          </Router>
        </ReduxProvider>
      </LensProvider>
    );
  };
}
