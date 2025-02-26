import { type Store, type Middleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "@src/redux/reducer";
import { backgroundTaskMiddleware } from "@redux/middlewares/backgroundTaskMiddleware.ts";
import {
  minibarInitialState,
  drawerInitialState,
  authInitialState,
  bookmarkInitialState,
  commentsInitialState,
  notificationsInitialState,
  followersInitialState,
  addressInitialState,
  blockchainEventsInitialState,
  transactionInitialState,
} from "@redux/index";

// Define the initial state with the correct structure
const initialState: RootState = {
  minibar: minibarInitialState,
  drawer: drawerInitialState,
  auth: authInitialState,
  bookmark: bookmarkInitialState,
  comments: commentsInitialState,
  notifications: notificationsInitialState,
  followers: followersInitialState,
  address: addressInitialState,
  blockchainEvents: blockchainEventsInitialState,
  transactions: transactionInitialState,
};

export const createStore = (preloadedState: RootState = initialState): Store => {
  const middlewares: Middleware[] = [backgroundTaskMiddleware];

  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(middlewares),
  });
};

export const store = createStore();
