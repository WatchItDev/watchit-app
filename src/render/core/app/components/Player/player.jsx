import React from 'react';
import PropTypes from 'prop-types';
import PlayerVideo from './video';
import HLS from '@main/core/hls';
import log from '@logger';
import {CustomButton} from "@watchitapp/watchitapp-uix";
import {Close} from "@mui/icons-material";
import {Box} from "@mui/material";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.v = null;
    this.player = null;
    this.streamer = HLS.getInstance();

    // Initial State
    this.state = {
      canStream: true
    };

    this.startStreaming = this.startStreaming.bind(this);
    this.stopStreaming = this.stopStreaming.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.canPlay;
  }

  static get defaultProps() {
    return {
      canPlay: false
    };
  }

  static get propTypes() {
    return {
      movie: PropTypes.object.isRequired,
      canPlay: PropTypes.bool.isRequired,
      onCanPlay: PropTypes.func,
      onError: PropTypes.func,
      onClose: PropTypes.func
    };
  }

  componentDidMount() {
    // Lets start watching :)
    this.startStreaming();
  }

  _initPlaying = () => {
    if (this.props.onCanPlay && !this.props.canPlay) {
      this.props.onCanPlay();
    }
  }

  _ready = () => {
    log.info('Player ready');
    this._initPlaying();
  }

  startStreaming() {
    if (!this.state.canStream) return;
    // Start streamer
    log.info('Streaming Movie: ' + this.props.movie?.meta?.title?.toUpperCase());
    const uriToStream = this.props.movie?.video; // Ready to play uri
    this.streamer = this.streamer.play(uriToStream, {videoRef: this.v.video}, this._ready, this.onError)
  }

  stopStreaming() {
    this.streamer.stop();
  }

  onClose() {
    this.stopStreaming();
    this.setState({ canStream: false });
    this.props?.onClose?.();
  }

  componentDidCatch(error, info) {
    log.error('Component Did Catch Error');
    log.error(error);
    log.info(info);
  }

  componentWillUnmount() {
    log.warn('STREAMING STOPPED BY USER');
    this.stopStreaming();
  }

  onError(e) {
    this.props.onError && this.props.onError(e);
    log.error(`Error while streaming ${JSON.stringify(e)}`);
    this.stopStreaming();
    if (this.state.canStream) {
      log.warn('Retrying...');
      this.startStreaming();
    }
  }

  getVideoRef = (ref) => {
    this.v = ref;
  }

  render() {
    return (
        <div className={(this.props.canPlay && 'left relative full-height full-width') || 'invisible'}>
          <Box sx={{ top: '1.2rem', right: '1.2rem', zIndex: '100', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'}>
            <CustomButton
                variant={'flat'}
                height={"30px"}
                width={"30px"}
                margin='0 0.5rem 0 0'
                icon={<Close style={{ color: '#D1D2D3' }} />}
                onClick={this.onClose}
            />
          </Box>
          <PlayerVideo ref={this.getVideoRef} />
        </div>
    );
  }
}
