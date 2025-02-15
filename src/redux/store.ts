import { type Store, type Middleware } from 'redux';
import { backgroundTaskMiddleware } from '@redux/middlewares/backgroundTaskMiddleware.ts';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@src/redux/reducer';

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

export const store = createStore();
export type RootState = ReturnType<typeof rootReducer>
