import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';

// ----------------------------------------------------------------------

// Custom hook to use the AuthContext
export const useWeb3Auth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
