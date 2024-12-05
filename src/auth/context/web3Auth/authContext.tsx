import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider: React.FC<{ web3Auth: any; children: React.ReactNode }> = ({ web3Auth, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    if (!web3Auth.provider) {
      await web3Auth.connect();
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await web3Auth.logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (web3Auth.provider) {
      setIsAuthenticated(true);
    }
  }, [web3Auth.provider]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
