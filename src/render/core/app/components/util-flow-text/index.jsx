import React from 'react'

export default class FlowText extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  static get defaultProps () {
    return {
      size: 20
    }
  }

  render () {
    return (
      <div className='col l12 s12 m12'>
        <p className='flow-text grey-text'>
          {this.props.children}
        </p>
      </div>
    )
  }
}
