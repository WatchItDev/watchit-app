import React from 'react'
import PropTypes from 'prop-types'
import Player from './player'
import PlayerHeader from './header'
import MainLoader from "@components/MainLoader";
import ButtonClose from "@components/ButtonClose";
import { Box, styled } from '@mui/material';

export default class PlayerHLS extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      canPlay: false,
      state: 'Connecting'
    }
  }

  static get propTypes () {
    return {
      movie: PropTypes.object.isRequired
    }
  }

  handleCanPlay = () => {
    this.setState({
      canPlay: true
    })
  }

  render() {
    return (
        <>
          {!this.state.canPlay && (
              <OverlayLoader>
                {this.props.onClose && <ButtonClose onClose={this.props.onClose} />}
                <MainLoader content={'Loading movie...'} />
              </OverlayLoader>
          )}

          <VideoStream>
            {this.state.canPlay && <PlayerHeader title={this.props.movie.title} />}

            <MovieBox>
              <Player
                  movie={this.props.movie}
                  canPlay={this.state.canPlay}
                  onCanPlay={this.handleCanPlay}
                  onClose={this.props.onClose}
              />
            </MovieBox>
          </VideoStream>
        </>
    );
  }
}

const OverlayLoader = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#1A1C20',
  position: 'absolute',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const VideoStream = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
}));

const MovieBox = styled(Box)(({ theme }) => ({
  height: '100%',
}));