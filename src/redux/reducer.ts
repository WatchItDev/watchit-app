import { combineReducers } from 'redux';
import minibarReducer from '@redux/minibar/index';
import drawerReducer from '@redux/drawer/index';

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export default rootReducer;
