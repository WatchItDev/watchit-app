import { combineReducers } from 'redux';
import minibarReducer from '@redux/minibar/index';
import drawerReducer from '@redux/drawer/index';
import authReducer from '@redux/auth/index';
import notificationsReducer from '@redux/notifications/index';
import bookmarkReducer from '@redux/bookmark/index';
import commentsReducer from '@redux/comments/index';
import followersReducer from '@redux/followers/index';
import addressReducer from '@redux/address/index';

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
  auth: authReducer,
  bookmark: bookmarkReducer,
  comments: commentsReducer,
  notifications: notificationsReducer,
  followers: followersReducer,
  address: addressReducer,
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export default rootReducer;
