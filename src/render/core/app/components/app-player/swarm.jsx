import React from 'react'
import PropTypes from 'prop-types'

export default class PlayerSwarm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dSpeed: 0.0,
      uSpeed: 0.0,
      dLoaded: 0,
      fSize: 0,
      aPeers: 0
    }
  }

  static get propTypes () {
    return {
      flix: PropTypes.object.isRequired
    }
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
  }

  componentDidMount () {
    // Interval to check for swarm info
    this.timeout = setInterval(() => {
      this.setState(this.props.flix.stats)
    }, 1000)
  }

  render () {
    return (
      (
        <ul>
          <li className='white-text'>
            <span className='bold'>
              <i className='icon-network margin-right-5' />
            </span>
            <span className={
              this.state.aPeers <= 10
                ? 'red-text'
                : this.state.aPeers < 15 && this.state.aPeers > 10
                  ? 'orange-text'
                  : 'green-text'
            }
            >
              {this.state.aPeers} {this.state.aPeers > 1 ? 'peers' : 'peer'}
            </span>
          </li>
          <li className='white-text'>
            <span className='bold'>
              <i className='icon-arrow-bold-down margin-right-5' />
            </span>
            <span
              className='green-text'
            >
              {(this.state.dLoaded > this.state.fSize && 0.00) || this.state.dSpeed}
            </span>
            <span className='bold'> / </span>
            <span className='bold'>
              <i className='icon-arrow-bold-up margin-right-5' />
            </span>
            <span className='green-text'>
              {this.state.uSpeed}
            </span>
          </li>

          <li className='white-text'>
            <span className='bold'>
              <i className='icon-download margin-right-5' />
            </span>
            <strong>{this.state.dLoaded}</strong>
            <span> of </span>
            <strong>{this.state.fSize} </strong>
          </li>
        </ul>
      )
    )
  }
}
