import React from 'react'

export default class AppMainUpdater extends React.PureComponent {


    render() {
        return <strong className={'white-text bold'}>
            {this.props.children}
        </strong>
    }
}
