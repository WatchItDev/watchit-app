import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionType, useSession } from '@lens-protocol/react-web';

interface SessionContextProps {
  sessionStatus: { authenticated: boolean, loading: boolean };
  manualSessionCheck: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, error, loading } = useSession();
  const [sessionStatus, setSessionStatus] = useState<{ authenticated: boolean, loading: boolean }>({ authenticated: false, loading: true });
  const navigate = useNavigate();

  const handleSession = useCallback(() => {
    if (loading) {
      if (sessionStatus.loading !== true) {
        setSessionStatus({ authenticated: false, loading: true });
      }
      return;
    }

    if (error) {
      console.error('Session error:', error);
      navigate('/error');
      return;
    }
console.log(data)
    if (data) {
      let authenticated = false;
      switch (data.type) {
        case SessionType.Anonymous:
          authenticated = false;
          break;

        case SessionType.JustWallet:
          authenticated = false;
          break;

        case SessionType.WithProfile:
          authenticated = true;
          break;

        default:
          console.error('Unknown session type:', data);
          navigate('/error');
          return;
      }

      if (sessionStatus.authenticated !== authenticated || sessionStatus.loading !== false) {
        setSessionStatus({ authenticated, loading: false });
      }
    }
  }, [data, error, loading, navigate, sessionStatus]);
console.log(sessionStatus)
  useEffect(() => {
    handleSession();
console.log("test")
    const intervalId = setInterval(() => {
      handleSession();
    }, 10000); // Poll every 60 seconds

    return () => clearInterval(intervalId);
  }, [handleSession]);

  const manualSessionCheck = useCallback(() => {
    handleSession();
  }, [handleSession]);

  const value = useMemo(() => ({ sessionStatus, manualSessionCheck }), [sessionStatus, manualSessionCheck]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
