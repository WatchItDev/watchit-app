import { type Store, type Middleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@src/redux/reducer';
import { backgroundTaskMiddleware } from '@redux/middlewares/backgroundTaskMiddleware.ts';

export const createStore = (initialState = {}): Store => {
  const middlewares: Middleware[] = [backgroundTaskMiddleware];

  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(middlewares),
  });
};

export type RootState = ReturnType<typeof store.getState>;

export const store = createStore();
