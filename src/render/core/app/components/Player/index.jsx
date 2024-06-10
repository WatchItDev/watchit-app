import React from 'react'
import PropTypes from 'prop-types'

import Player from './player'
import PlayerHeader from './header'
import MainLoader from "@components/MainLoader";
import ButtonClose from "@components/ButtonClose";
import {Close} from "@mui/icons-material";
import CustomButton from "@components/CustomButton";

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

  render () {
    return (
      <>
        {
          (
            !this.state.canPlay &&
              <div className='absolute full-width full-height player-overlay-loader'>
                {this.props.onClose && <ButtonClose onClose={this.props.onClose} />}
                <MainLoader content={'Loading movie...'} />
              </div>
          )
        }

        <section className='absolute full-height full-width clearfix video-stream'>
          {/* Movie torrent info */}
          {this.state.canPlay && <PlayerHeader title={this.props.movie.title} />}

          {/* Main player */}
          <div className='full-height movie-box'>
            <Player
              movie={this.props.movie}
              canPlay={this.state.canPlay}
              onCanPlay={this.handleCanPlay}
              onClose={this.props.onClose}
            />
          </div>
        </section>
      </>
    )
  }
}
