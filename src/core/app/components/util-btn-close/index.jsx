import React from 'react'


export default class BtnClose extends React.Component {
    static get defaultProps() {
        return {
            action: '#',
            onClick: null
        }
    }

    onClick = (e) => {
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <a href={this.props.action} onClick={this.onClick}
               className="btn-close clearfix font-size-45">
                <i className="icon-cross white-text"/>
            </a>
        )
    }
}
