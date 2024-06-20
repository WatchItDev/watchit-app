import React, { useState, useEffect } from 'react';
import Logo from '@components/Logo/';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import settings from '@settings';

const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const UPDATER_EVENT = 'update-available';
const DEFAULT_UPDATER_MESSAGE = 'A new update is available. The app it is being updated and will restart on completion...';

const DragBar = (props) => {
  const [updater, setUpdater] = useState('');

  const updateOnlineStatus = () => {
    ipcRenderer.send('online-status-changed', navigator.onLine);
  };

  useEffect(() => {
    ipcRenderer.on(UPDATER_EVENT, () => setUpdater(DEFAULT_UPDATER_MESSAGE));
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      ipcRenderer.removeAllListeners(UPDATER_EVENT);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const closeWin = () => {
    ipcRenderer.send('close');
  };

  const minimizeWin = () => {
    ipcRenderer.send('minimize');
  };

  const maximizeWin = () => {
    ipcRenderer.send('maximize');
  };

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

export default React.memo(DragBar);

// Styled Components
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

