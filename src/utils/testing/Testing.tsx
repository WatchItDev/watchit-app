import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '@redux/reducer';

const store = createStore(rootReducer);

export namespace Testing {
  export const renderWithStoreAndRouter = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <Router future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }} >
          {ui}
        </Router>
      </Provider>
    );
  };
}
