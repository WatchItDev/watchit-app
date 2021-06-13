import React from 'react'
import PlayerSwitch from 'components/app-player/'

// Movie player page
export default function MoviePlayer (props) {
  return <PlayerSwitch params={props.match.params} />
}
