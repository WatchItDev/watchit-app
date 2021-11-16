import React from 'react'

export default class ButtonClose extends React.Component {
  static get defaultProps () {
    return {
      action: '#',
      onClick: null
    }
  }

  handleClick = (e) => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <a
        href={this.props.action} onClick={this.handleClick}
        className='btn-close clearfix font-size-45'
      >
        <i className='icon-cross white-text' />
      </a>
    )
  }
}
