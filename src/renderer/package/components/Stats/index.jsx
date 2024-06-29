// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Box, Link, styled } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

// ----------------------------------------------------------------------
// MAIN COMPONENT

const Stats = (props) => {
  return (
      <StatWrapper>
        <LogOut onClick={props.onSignOut} href='/'>
          <LogoutIcon sx={{ color: '#fff' }} />
        </LogOut>
      </StatWrapper>
  );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const StatWrapper = styled(Box)(() => ({
  display: 'flex',
}));

const LogOut = styled(Link)(() => ({
  padding: '0 1rem 0 2rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default React.memo(Stats);
