import React from 'react';
import log from 'logger'
import Logo from 'components/util-header-logo'
import AppUpdater from 'components/util-updater'
import AppNotify from 'components/util-notify'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const MIDDLEWARE_TORRENT_EVENT = 'middleware-torrent-seed'
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
        ipcRenderer.removeAllListeners(MIDDLEWARE_TORRENT_EVENT)
        ipcRenderer.removeAllListeners(UPDATER_EVENT);
        ipcRenderer.on(MIDDLEWARE_TORRENT_EVENT, (e, m) => this.setState({seed: m}))
        ipcRenderer.on(UPDATER_EVENT, () => this.setState({updater: DEFAULT_UPDATER_MESSAGE}));

        window.removeEventListener('online', this.updateOnlineStatus)
        window.removeEventListener('offline', this.updateOnlineStatus)
        window.addEventListener('online', this.updateOnlineStatus)
        window.addEventListener('offline', this.updateOnlineStatus)
    }

    startSeeding = () => {
        // Reply to main process to start seeding
        log.info('Accepted seed request')
        ipcRenderer.send(MIDDLEWARE_TORRENT_EVENT, {
            signal: MIDDLEWARE_TORRENT_EVENT, payload: {}
        })
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
                    {this.state.seed && <AppNotify notify={this.state.seed}>
                        <div>
                            <p>{this.state.seed}</p>
                            <button onClick={this.startSeeding}>Accept</button>
                        </div>
                    </AppNotify>}

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
