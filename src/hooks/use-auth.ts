import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@redux/store.ts';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth, shallowEqual);
  return auth;
};
