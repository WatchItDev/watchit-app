import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class StatsValue extends React.PureComponent {

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
        return <Text>
            {this.props.type}: {this.props.value}
        </Text>
    }
}

const Text = styled.span`
  color: #fff;
`;