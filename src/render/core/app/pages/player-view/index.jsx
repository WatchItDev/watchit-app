import React from 'react'
import PlayerSwitch from 'components/app-player/'

//Movie player pages class
export default class MoviePlayer extends React.Component {

  render () {
    return (
      <PlayerSwitch params={this.props.match.params}/>
    )
  }
}