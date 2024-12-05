import { useContext } from 'react';
import { AuthContext } from '../auth/context/web3Auth';

// ----------------------------------------------------------------------

// Custom hook to use the AuthContext
export const useWeb3Auth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
