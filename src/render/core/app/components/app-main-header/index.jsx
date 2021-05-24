import React from 'react';
import Logo from 'components/util-header-logo';
import AppUpdater from 'components/util-updater';
import utilHelper from "helpers/util";
import styled from 'styled-components';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const UPDATER_EVENT = 'update-available'
const DEFAULT_UPDATER_MESSAGE = 'A new update is available. The app it is being updated and will restart on completion...'

export default class MainHeader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            seed: null,
            updater: null
        }
    }

    updateOnlineStatus = () => {
        ipcRenderer.send('online-status-changed',
            navigator.onLine
        )
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners(UPDATER_EVENT);
        ipcRenderer.on(UPDATER_EVENT, () => this.setState({updater: DEFAULT_UPDATER_MESSAGE}));
        window.removeEventListener('online', this.updateOnlineStatus)
        window.removeEventListener('offline', this.updateOnlineStatus)
        window.addEventListener('online', this.updateOnlineStatus)
        window.addEventListener('offline', this.updateOnlineStatus)
    }

    closeWin() {
        ipcRenderer.send('close')
    }

    minimizeWin() {
        ipcRenderer.send('minimize')
    }

    maximizeWin() {
        ipcRenderer.send('maximize')
    }

    render() {
        return (
            <Container>
                <Header>
                    <Logo />
                    {this.state.updater && <AppUpdater>{this.state.updater}</AppUpdater>}
                    <WindowControls>
                        <WindowControl onClick={(e) => this.minimizeWin(e)}>
                            <WindowControlIcon className="icon-circle-with-minus" color="warning"/>
                        </WindowControl>
                        <WindowControl onClick={(e) => this.maximizeWin(e)}>
                            <WindowControlIcon className="icon-circle-with-plus" color="success"/>
                        </WindowControl>
                        <WindowControl onClick={(e) => this.closeWin(e)}>
                            <WindowControlIcon className="icon-circle-with-cross" color="danger"/>
                        </WindowControl>
                    </WindowControls>
                </Header>
                {this.props.children}
            </Container>
        )
    }
}

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Header = styled.header`
  z-index: 1000;
  position: relative;
  top: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 300px) {
    height: 3.5rem;
  }

  @media (min-width: 992px) {
    height: 4rem;
  }

  @media (min-width: 2000px) {
    height: 6rem;
  }
`;

const WindowControls = styled.ul`
  -webkit-app-region: no-drag;
  position: relative;
  align-items: center;
  display: flex;
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const WindowControl = styled.li`
  margin-right: 4px;
  align-items: center;
  display: flex;
  list-style-type: none;
  text-align: -webkit-match-parent;
`;

const WindowControlIcon = styled.i`
  font-size: 1rem;
  color: ${({color}) => utilHelper.handleColorType(color)};
  
  @media (min-width: 300px) {
    font-size: 1.1rem
  }

  @media (min-width: 992px) {
    font-size: 1.2rem
  }

  @media (min-width: 2000px) {
    font-size: 2rem;
  }
`;

