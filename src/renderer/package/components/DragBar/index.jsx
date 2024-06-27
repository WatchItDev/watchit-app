// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, styled } from '@mui/material'

// LOCAL IMPORTS
import Logo from '@/renderer/package/components/Logo/'
import settings from '@/renderer/settings'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const DragBar = (props) => {
  const closeWin = () => {
    window.electron.ipcRenderer.send('win:invoke', 'close')
  }

  const minimizeWin = () => {
    window.electron.ipcRenderer.send('win:invoke', 'min')
  }

  const maximizeWin = () => {
    window.electron.ipcRenderer.send('win:invoke', 'max')
  }

  return (
      <Container>
        <Header>
          <Logo size={50} />
          <WindowControls>
            <WindowControl onClick={minimizeWin}>
              <WindowControlIcon className='icon-circle-with-minus' color={settings.styles.colors.warningDark} />
            </WindowControl>
            <WindowControl onClick={maximizeWin}>
              <WindowControlIcon className='icon-circle-with-plus' color={settings.styles.colors.successDark} />
            </WindowControl>
            <WindowControl onClick={closeWin}>
              <WindowControlIcon className='icon-circle-with-cross' color={settings.styles.colors.dangerDark} />
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

const WindowControl = styled(Box)({
  marginRight: '4px',
  display: 'flex',
  alignItems: 'center',
  listStyleType: 'none',
});

const WindowControlIcon = styled('i')(({ color }) => ({
  fontSize: '1rem',
  color: color,
  cursor: 'pointer',
  '@media (min-width: 300px)': {
    fontSize: '1.1rem',
  },
  '@media (min-width: 992px)': {
    fontSize: '1.2rem',
  },
  '@media (min-width: 2000px)': {
    fontSize: '2rem',
  },
}));

// ----------------------------------------------------------------------

export default React.memo(DragBar);
