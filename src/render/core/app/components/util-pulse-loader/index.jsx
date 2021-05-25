import React from 'react'

export default class PulseLoader extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className='spinner' {...this.props}>
        <div className='double-bounce1' />
        <div className='double-bounce2' />
      </div>
    )
  }
}
