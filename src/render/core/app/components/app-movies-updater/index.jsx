import React from 'react'

const electron = window.require('electron');
const log = window.require("electron-log");
const ipcRenderer = electron.ipcRenderer;
const webFrame = electron.webFrame;

export default class AppMainUpdater extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nRef = null;
        this.mRef = null;
    }

    componentDidMount() {
        // Clear old cache on render
        // Restart listeners
        // Check for updates
        webFrame.clearCache();
        log.info('Requesting update');
        ipcRenderer.removeAllListeners('update_available');
        ipcRenderer.send('check_update'); // Check for update
        ipcRenderer.on('update_available', () => {
            this.mRef.innerText = 'A new update is available. The app it is being updated and will restart on completion...';
            this.nRef.classList.remove('hidden');
        });

    }


    getMRef = (r) => {
        this.mRef = r
    }

    getNRef = (r) => {
        this.nRef = r
    }

    render() {
        return <div id="notification" ref={this.getNRef} className="hidden">
            <p ref={this.getMRef}>Checking updates..</p>
        </div>
    }
}
