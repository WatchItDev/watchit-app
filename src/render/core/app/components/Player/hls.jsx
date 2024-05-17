import React from 'react'
import PropTypes from 'prop-types'
import StateLoader from '@components/PlayerLoader'
import Player from './player'
import PlayerHeader from './header'

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
                <StateLoader stateText={this.state.state} statePercent={0} />
              </div>
          )
        }

        <section className='absolute full-height clearfix video-stream'>
          {/* Movie torrent info */}
          {this.state.canPlay && <PlayerHeader title={this.props.movie.title} />}

          {/* Main player */}
          <div className='full-height movie-box'>
            <Player
              movie={this.props.movie}
              canPlay={this.state.canPlay}
              onCanPlay={this.handleCanPlay}
            />
          </div>
        </section>
      </>
    )
  }
}
