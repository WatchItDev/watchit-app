import React from 'react'
import PropTypes from 'prop-types'
import setting from '@settings'

import PlayerShare from './share'
import PlayerVideo from './video'

import HLS from '@main/core/hls'
import log from '@logger'

export default class Player extends React.Component {
  constructor (props) {
    super(props)
    this.v = null
    this.player = null

    // Initial State
    this.state = {}
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return nextProps.canPlay
  }

  static get defaultProps () {
    return {
      canPlay: false
    }
  }

  static get propTypes () {
    return {
      movie: PropTypes.object.isRequired,
      canPlay: PropTypes.bool.isRequired
    }
  }

  async componentDidMount () {
    // Lets start watching :)
    this.startStreaming()
  }

  _initPlaying = () => {
    if (this.props.onCanPlay && !this.props.canPlay) {
      this.props.onCanPlay()
    }
  }

  _ready () {
    log.info('Player ready')
    this._initPlaying()
  }

  startStreaming () {
    // Start streamer
    log.info('Streaming Movie: ' + this.props.movie.title.toUpperCase())
    const uriToStream = this.props.movie.route // Ready to play uri
    const streamer = this.streamer.play(uriToStream, { videoRef: this.v.video })
    streamer.on('error', this.onError)
    streamer.on('ready', () => this._ready())
  }

  stopStreaming () {
    this.streamer.stop()
    this.streamer.removeAllListeners()
  }

  get streamer () {
    const _type = this.props.movie.type
    if (!setting.streaming.includes(_type)) {
      throw new Error('Not support streaming mechanism')
    }

    return {
      hls: HLS.getInstance()
    }[_type]
  }

  componentDidCatch (error, info) {
    log.error('Component Did Catch Error')
    log.error(error)
    log.info(info)
  }

  // destroy player on unmount
  componentWillUnmount () {
    log.warn('STREAMING STOPPED BY USER')
    this.stopStreaming()
  }

  onError = (e) => {
    // Handle error
    this.props.onError && this.props.onError(e)
    log.error('Error while streaming')
    log.warn('Retrying...')
    this.stopStreaming()
    this.startStreaming()
  }

  getVideoRef = (ref) => {
    this.v = ref
  }

  render () {
    return (
      <div className={(this.props.canPlay && 'left relative full-height full-width') || 'invisible'}>
        <PlayerShare devices={this.state.devices} onChange={this.handleSelectDevice} />
        <PlayerVideo ref={this.getVideoRef} />
      </div>
    )
  }
}
