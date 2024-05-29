import React from 'react'
import PropTypes from 'prop-types'
import Player from './player'
import PlayerHeader from './header'

export default class PlayerHls extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      canPlay: true,
      state: 'Connecting'
    }
  }

  static get propTypes () {
    return {
      movie: PropTypes.object.isRequired
    }
  }

  handleClose = () => {
    this.setState({
      canPlay: false
    })
    this.props?.onClose()
  }

  render () {
    return (
        <>
          <section className='absolute full-height full-width clearfix video-stream'>
            {/* Movie torrent info */}
            <PlayerHeader title={this.props?.movie?.meta?.title} />

            {/* Main player */}
            <div className='full-height movie-box'>
              <Player
                  movie={this.state.canPlay ? this.props.movie : null}
                  canPlay={true}
                  onClose={this.handleClose}
              />
            </div>
          </section>
        </>
    )
  }
}