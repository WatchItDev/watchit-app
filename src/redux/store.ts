import { type Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@src/redux/reducer';

export const createStore = (initialState = {}): Store => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type RootState = ReturnType<typeof store.getState>;

export const store = createStore();
