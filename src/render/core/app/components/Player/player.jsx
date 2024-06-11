import React from 'react'
import PropTypes from 'prop-types'

import PlayerVideo from './video'
import HLS from '@main/core/hls'
import gateway from "@helpers/gateway";
import log from '@logger'
import { Close } from "@mui/icons-material";
import CustomButton from "@components/CustomButton";
import ButtonClose from "@components/ButtonClose";

export default class Player extends React.Component {
  constructor(props = {
    canPlay: false
  }) {
    super(props)
    this.v = null
    this.player = null
    this.streamer = HLS.getInstance();

    // Initial State
    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.canPlay
  }


  static get propTypes() {
    return {
      movie: PropTypes.object.isRequired,
      canPlay: PropTypes.bool.isRequired
    }
  }

  async componentDidMount() {
    // Lets start watching :)
    this.startStreaming()
  }

  _initPlaying = () => {
    if (this.props.onCanPlay && !this.props.canPlay) {
      this.props.onCanPlay()
    }
  }

  _ready() {
    log.info('Player ready')
    this._initPlaying()
  }

  startStreaming() {
    // Start streamer
    log.info('Streaming Movie: ' + this.props.movie.title.toUpperCase())
    const uriToStream = `${gateway.parse(this.props.movie.video)}/index.m3u8`// Ready to play uri
    const streamer = this.streamer.play(uriToStream, { videoRef: this.v.video })
    streamer.on('error', this.onError)
    streamer.on('ready', () => this._ready())
  }

  stopStreaming() {
    this.streamer.stop()
    this.streamer.removeAllListeners()
  }

  componentDidCatch(error, info) {
    log.error('Component Did Catch Error')
    log.error(error)
    log.info(info)
  }

  // destroy player on unmount
  componentWillUnmount() {
    log.warn('STREAMING STOPPED BY USER')
    this.stopStreaming()
  }

  onError = (e) => {
    // Handle error
    this.props.onError && this.props.onError(e)
    log.error(`Error while streaming ${JSON.stringify(e)}`)
    log.warn('Retrying...')
    this.stopStreaming()
    this.startStreaming()
  }

  getVideoRef = (ref) => {
    this.v = ref
  }

  render() {
    return (
      <div className={(this.props.canPlay && 'left relative full-height full-width') || 'invisible'}>
        {this.props.onClose && <ButtonClose onClose={this.props.onClose} />}
        <PlayerVideo ref={this.getVideoRef} />
      </div>
    )
  }
}
