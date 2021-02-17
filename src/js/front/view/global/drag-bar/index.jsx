import React from 'react';
import Logo from 'js/front/components/generic/util-header-logo'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default class DragBar extends React.PureComponent {

    updateOnlineStatus = () => {
        ipcRenderer.send('online-status-changed',
            navigator.onLine
        )
    }

    componentDidMount() {
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
                    <Logo />

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
