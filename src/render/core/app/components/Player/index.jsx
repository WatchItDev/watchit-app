import React from 'react'
import MainLoader from '@components/MainLoader/'
import ButtonClose from '@components/ButtonClose/'

import Movie from '@db/movies'
import { Broker as broker } from '@main/bridge'

import cryptHelper from '@helpers/crypt'
import PlayerHLS from './hls'
import log from '@logger'

// Movie player pages class
export default class PlayerSwitch extends React.Component {
  constructor (props) {
    super(props)

    // Movie init local db
    this.movie = new Movie(broker)
    // Decode string and pass to json object
    this.state = {
      stopped: false,
      toggle_screen: false
    }
  }

  componentDidMount () {
    // Decode param
    const _movie = JSON.parse(
      cryptHelper.fromBase64(
        this.props.params.resource
      )
    )

    // Set subs from movie if exists
    this.movie.get(_movie.id).then((res) => {
      // Set new subs
      this.setState({
        movie: { ..._movie, ...{ title: res.title } }
      })
    }).catch((e) => {
      log.error('Error in movie get', e)
    })
  }

  switchPlayer = (type) => {
    const types = {
      hls: PlayerHLS
    }

    if (type in types) { return types[type] }
  }

  render () {
    return (
      <div className='movie-player full-width full-height'>
        <ButtonClose action='#/app/movies' />
        {
          (
            this.state.movie && React.createElement(
              this.switchPlayer(this.state.movie.type), {
                movie: this.state.movie,
                subs: this.state.movieSubs
              }
            )
          )
        }
        {/* Loader box */}
        {this.state.stopped && <MainLoader />}
      </div>
    )
  }
}
