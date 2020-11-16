import React from 'react'
import PropTypes from 'prop-types'

export default class StatsValue extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            value: 0,
        }
    }

    static get propTypes() {
        return {
            type: PropTypes.string.isRequired
        }
    }

    render() {
        return <span>
            {this.props.type}: {this.props.value}
        </span>

    }
}
