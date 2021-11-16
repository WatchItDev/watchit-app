import React from 'react'
import PlayerSwitch from '@components/Player/'

// Movie player page
export default function MoviePlayer (props) {
  return <PlayerSwitch params={props.match.params} />
}
