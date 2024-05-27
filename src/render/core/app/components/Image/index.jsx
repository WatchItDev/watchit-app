import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from '@components/PulseLoader'
import log from '@logger'
import settings from '@settings'

export default class Image extends React.PureComponent {
  constructor(props) {
    super(props)
    this.img = null
    this.state = {
      loaded: false,
      attempt: 0
    }
    this.retryTimeout = null
    this.loadTimeout = null
    this.gateways = settings.gateways()
  }

  static get propTypes() {
    return {
      src: PropTypes.string.isRequired,
      preload: PropTypes.bool,
      pulseStyle: PropTypes.object
    }
  }

  static get defaultProps() {
    return {
      preload: false,
      pulseStyle: null
    }
  }

  handleImageLoaded = () => {
    if (this.state.loaded) return
    this.setState({
      loaded: true
    })
    clearTimeout(this.loadTimeout)
    clearTimeout(this.retryTimeout)
  }

  componentDidMount() {
    const img = this.img
    if (img && img.complete) {
      this.handleImageLoaded()
    } else {
      this.setLoadTimeout()
    }
  }

  componentWillUnmount() {
    if (this.img) {
      this.img.src = '' // Abort
    }
    clearTimeout(this.retryTimeout)
    clearTimeout(this.loadTimeout)
  }

  handleImageError = () => {
    this.retryLoadingImage()
  }

  setLoadTimeout = () => {
    if (!this.state.loaded) {
      log.warn(`Image load timeout on attempt ${this.state.attempt + 1}, retrying...`)
      this.retryLoadingImage()
    }
  }

  retryLoadingImage = () => {
    log.warn(`Fail image request on attempt ${this.state.attempt + 1}, retrying...`)
    clearTimeout(this.retryTimeout)
    this.retryTimeout = setTimeout(() => {
      this.setState(
          prevState => ({
            attempt: (prevState.attempt + 1) % this.gateways.length, // Loop through gateways
            loaded: false
          }),
          () => {
            this.img.src = this.getRetrySrc(this.props.src)
            this.setLoadTimeout()
          }
      )
    }, 2000) // Throttling delay of 1 second
  }

  getRetrySrc = (src) => {
    const { attempt } = this.state
    const gateway = this.gateways[attempt]
    return `${gateway}/ipfs/${src}`
  }

  getRef = (i) => {
    this.img = i
  }

  render() {
    const { preload, pulseStyle, src } = this.props
    return (
        <figure className='image-container no-margin'>
          {
              !this.state.loaded && preload &&
              <PulseLoader style={pulseStyle} />
          }
          <img
              alt='' src={this.getRetrySrc(src)} onLoad={this.handleImageLoaded}
              onError={this.handleImageError} ref={this.getRef}
              className={(this.state.loaded || !preload) ? 'loaded-img responsive-img' : 'locked-img'}
          />
        </figure>
    )
  }
}
