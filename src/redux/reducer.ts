import { combineReducers } from 'redux';
import minibarReducer from '@redux/minibar/index';
import drawerReducer from '@redux/drawer/index';
import authReducer from '@redux/auth/index';

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
  auth: authReducer
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export default rootReducer;
