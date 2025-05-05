import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '@redux/store.ts';
import { AuthReducerState } from '@redux/types.ts';

export const useAuth = (): AuthReducerState => {
  return useSelector((state: RootState) => state.auth, shallowEqual);
};
