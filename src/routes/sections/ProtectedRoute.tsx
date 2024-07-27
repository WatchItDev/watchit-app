import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography, CircularProgress, Box } from '@mui/material';

import { useSessionContext } from './SessionContext';
import Login from '../../pages/login';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { sessionStatus } = useSessionContext();

  if (sessionStatus.loading) return <Box display="flex" alignItems="center"
    justifyContent= "center"
    height= "100vh" // Full viewport height
    margin= "0">
    <CircularProgress size={104} />
  </Box>;

  if (sessionStatus.authenticated) return (
    <>{children}</>


  );

  return   <><Navigate to="/login" />

    <Login />
  </>;
};

export default ProtectedRoute;
