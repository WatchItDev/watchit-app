import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from '@components/PulseLoader'
import log from '@logger'

export default class Image extends React.PureComponent {
  constructor(props = {
    preload: false,
    pulseStyle: null
  }) {
    super(props)
    this.img = null
    this.state = {
      loaded: false
    }
  }

  static get propTypes() {
    return {
      src: PropTypes.string.isRequired
    }
  }

  handleImageLoaded = () => {
    setTimeout(() => this.setState({
      loaded: true
    }), 0)
  }

  componentDidMount() {
    const img = this.img?.current
    if (img && img.complete) {
      this.handleImageLoaded()
    }
  }

  componentWillUnmount() {
    this.img.src = '' // Abort
  }

  handleImageError = () => {
    log.warn('Fail image request')
    log.warn('Retrying...')
    this.setState({ loaded: false }, () => {
      this.forceUpdate()
    })
  }

  getRef = (i) => {
    this.img = i
  }

  render() {
    return (
      <figure className='image-container no-margin'>
        {
          // Pulse loader
          !this.state.loaded && this.props.preload &&
          <PulseLoader style={this.props.pulseStyle} />
        }
        <img
          alt='' src={this.props.src} onLoad={this.handleImageLoaded}
          loading='lazy' onError={this.handleImageError} ref={this.getRef}
          className={(this.state.loaded || !this.props.preload)
            ? 'loaded-img responsive-img'
            : 'locked-img'}
        />
      </figure>
    )
  }
}
