import React from 'react'

export default class AppNotifyAlert extends React.PureComponent {
    render() {
        return <div id="notification">
            <header>
                <strong>Notification</strong>
            </header>
            {this.props.children}
        </div>
    }
}

