import React from 'react';
import Logo from 'components/util-header-logo/'
import AppUpdater from 'components/util-updater/'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const UPDATER_EVENT = 'update-available'
const DEFAULT_UPDATER_MESSAGE = 'A new update is available. The app it is being updated and will restart on completion...'

export default class DragBar extends React.PureComponent {

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
        //'close'
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
            <section className="full-width full-height absolute">
                <header id="drag-bar"
                        className={`relative transparent z-depth-100 z-index-1000`}>
                    <Logo/>
                    {this.state.updater && <AppUpdater>{this.state.updater}</AppUpdater>}
                     <ul className="list-unlisted relative d-flex align-items-center">
                        <li onClick={(e) => this.minimizeWin(e)} className="margin-right-4 d-flex align-items-center">
                            <i className="icon-circle-with-minus orange-text"/>
                        </li>
                        <li onClick={(e) => this.maximizeWin(e)} className="margin-right-4 d-flex align-items-center">
                            <i className="icon-circle-with-plus green-text "/>
                        </li>
                        <li onClick={(e) => this.closeWin(e)} className="margin-right-4 d-flex align-items-center">
                            <i className="icon-circle-with-cross red-text"/>
                        </li>
                    </ul>
                </header>
                {this.props.children}
            </section>

        )
    }
}
