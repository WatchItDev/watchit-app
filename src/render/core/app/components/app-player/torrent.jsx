import React from 'react'
import PropTypes from 'prop-types'
import StateLoader from 'components/app-state-loader'

import Player from './player'
import PlayerSwarm from './swarm'
import PlayerHeader from './header'

export default class PlayerTorrent extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      flix: null,
      canPlay: false,
      state: 'Connecting',
      percent: 0
    }
  }

  static get propTypes () {
    return {
      movie: PropTypes.object.isRequired
    }
  }

    onProgress = (_, percent, state) => {
      // Change state
      this.setState({
        state: state,
        percent: parseInt(percent)
      })
    }

    onReady = (...rest) => {
      const [, flix] = rest
      // Change state
      this.setState({
        state: 'Starting',
        flix: flix,
        percent: 100
      })
    }

    onCanPlay = () => {
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
                            <StateLoader
                              stateText={this.state.state}
                              statePercent={this.state.percent}
                            />
                            />
                          </div>
                    )
                }

          <section className='absolute full-height clearfix video-stream'>
            {/* Movie torrent info */}
            {
                        (
                            this.state.flix && this.state.canPlay &&
                              <PlayerHeader title={this.props.movie.title}>
                                <PlayerSwarm
                                  flix={this.state.flix}
                                />
                              </PlayerHeader>

                        )
                    }

            {/* Main player */}
            <div className='full-height movie-box'>
              <Player
                movie={this.props.movie}
                subs={this.props.subs}
                canPlay={this.state.canPlay}
                onProgress={this.onProgress}
                onReady={this.onReady}
                onCanPlay={this.onCanPlay}
              />
            </div>
          </section>
        </>
      )
    }
}
