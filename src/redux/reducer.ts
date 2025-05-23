import { combineReducers, Action } from 'redux';
import minibarReducer from '@redux/minibar/index';
import drawerReducer from '@redux/drawer/index';
import authReducer from '@redux/auth/index';
import notificationsReducer from '@redux/notifications/index';
import bookmarkReducer from '@redux/bookmark/index';
import commentsReducer from '@redux/comments/index';
import followersReducer from '@redux/followers/index';
import addressReducer from '@redux/address/index';
import blockchainEventsReducer from '@redux/blockchain-events/index';
import transactionsReducer from '@redux/transactions/index';
import loadingReducer from '@redux/loading/index';

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
  auth: authReducer,
  bookmark: bookmarkReducer,
  comments: commentsReducer,
  notifications: notificationsReducer,
  followers: followersReducer,
  address: addressReducer,
  blockchainEvents: blockchainEventsReducer,
  transactions: transactionsReducer,
  loading: loadingReducer,
});

type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: Action): RootState => {
  return appReducer(state, action);
};

export default rootReducer;
