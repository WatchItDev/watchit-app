import React from 'react';
import { useSelector } from 'react-redux';
import ShouldLogin from '@src/components/should-login/should-login';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const sessionData = useSelector((state: any) => state.auth.session);

    if (!sessionData?.authenticated) {
      return <ShouldLogin />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
