import React from 'react'

export default class DetailsHeader extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  static get defaultProps () {
    return {
      action: '#/app/movies'
    }
  }

  render () {
    return (
      <header className='row vertical-padding horizontal-padding transparent z-depth-1 clearfix'>
        <div className='col l6 m6'>
          <h5 className='white-text bold'>
            {
                            this.props.icon &&
                              <i className={`${this.props.icon} margin-right-1-rem normalize-small-icon`} />
                        }
            {this.props.text}
          </h5>
        </div>
        <a href={this.props.action} onClick={this.props.onClick} className='top-0 right'>
          <i className='icon-cross font-size-45 white-text' />
        </a>
      </header>
    )
  }
}
