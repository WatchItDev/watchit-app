// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, styled, IconButton } from '@mui/material'
import MinimizeIcon from '@mui/icons-material/Remove'
import MaximizeIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

// LOCAL IMPORTS
import Logo from '@/renderer/package/components/Logo/'
import settings from '@/renderer/settings'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const DragBar = (props) => {
  const closeWin = () => {
    window.ipc.send('win:invoke', 'close')
  }

  const minimizeWin = () => {
    window.ipc.send('win:invoke', 'min')
  }

  const maximizeWin = () => {
    window.ipc.send('win:invoke', 'max')
  }

  return (
      <Container>
        <Header>
          <Logo size={50} />
          <WindowControls>
            <WindowControl onClick={minimizeWin} sx={{ backgroundColor: `${settings.styles.colors.warningDark} !important` }}>
              <MinimizeIcon />
            </WindowControl>
            <WindowControl onClick={maximizeWin} sx={{ backgroundColor: `${settings.styles.colors.successDark} !important` }}>
              <MaximizeIcon />
            </WindowControl>
            <WindowControl onClick={closeWin} sx={{ backgroundColor: `${settings.styles.colors.dangerDark} !important` }}>
              <CloseIcon />
            </WindowControl>
          </WindowControls>
        </Header>
        {props.children}
      </Container>
  );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const Container = styled(Box)({
  position: 'absolute',
  height: '100%',
  width: '100%',
});

const Header = styled(Box)({
  '-webkit-app-region': 'drag',
  zIndex: 1000,
  position: 'relative',
  top: 0,
  right: 0,
  left: 0,
  backgroundColor: '#1A1C20',
  padding: '1rem',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media (min-width: 300px)': {
    height: '3.5rem',
  },
  '@media (min-width: 992px)': {
    height: '4rem',
  },
  '@media (min-width: 2000px)': {
    height: '6rem',
  },
});

const WindowControls = styled(Box)({
  '-webkit-app-region': 'no-drag',
  position: 'relative',
  display: 'flex',
  margin: 0,
  padding: 0,
  listStyleType: 'none',
});

const WindowControl = styled(IconButton)(() => ({
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  width: '1rem',
  height: '1rem',
  opacity: 0.8,
  '&:hover': {
    opacity: 1
  },
  '& svg': {
    color: '#fff',
    fontSize: '0.8rem',
    '@media (min-width: 2000px)': {
      fontSize: '1.1rem',
    },
  },
  '@media (min-width: 2000px)': {
    width: '1.5rem',
    height: '1.5rem',
  },
}));

// ----------------------------------------------------------------------

export default React.memo(DragBar);
