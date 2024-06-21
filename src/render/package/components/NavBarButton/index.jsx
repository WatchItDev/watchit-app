import React from 'react'
import PropTypes from 'prop-types'

export default class NavBarButton extends React.Component {
  constructor(props = {
    mrb: 5,
    link: {}
  }) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !Object.is(nextProps.link.href, this.props.link.href)
  }

  static get propTypes() {
    return {
      text: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    }
  }

  preventDefault(e) {
    e.preventDefault()
  }

  render() {
    return (
      <ul>
        <li className='dropdown'>
          <a className='dropdown-button flow-text clearfix' {...this.props.link}>
            <span className='font-light-gray right'>{this.props.text}</span>
            <i className={`${this.props.icon} normalize-small-icon float-left margin-right-${this.props.mrb}`} />
          </a>
        </li>
      </ul>
    )
  }
}
