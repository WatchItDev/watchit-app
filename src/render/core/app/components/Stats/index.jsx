import React from 'react';
import { Box, Link, Icon, styled } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Stats = (props) => {
  return (
      <StatWrapper>
        <LogOut onClick={props.onSignOut} href='/'>
          <LogoutIcon sx={{ color: '#fff' }} />
        </LogOut>
      </StatWrapper>
  );
};

const StatWrapper = styled(Box)(() => ({
  display: 'flex',
}));

const LogOut = styled(Link)(() => ({
  padding: '0 1rem 0 2rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
}));

export default React.memo(Stats);
