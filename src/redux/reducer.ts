import { combineReducers, Action } from 'redux';
import minibarReducer from '@redux/minibar/index';
import drawerReducer from '@redux/drawer/index';
import authReducer from '@redux/auth/index';
import notificationsReducer from '@redux/notifications/index';
import addressReducer from '@redux/address/index';
import blockchainEventsReducer from '@redux/blockchain-events/index';
import transactionsReducer from '@redux/transactions/index';

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
  auth: authReducer,
  notifications: notificationsReducer,
  address: addressReducer,
  blockchainEvents: blockchainEventsReducer,
  transactions: transactionsReducer,
});

type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: Action): RootState => {
  return appReducer(state, action);
};

export default rootReducer;
