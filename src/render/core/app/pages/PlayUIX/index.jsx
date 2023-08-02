// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { styled, Box } from '@mui/material'

// WATCHIT_UIX PACKAGE IMPORTS
import { VideoPlayer } from '@zorrillosdev/watchit_uix'

// REACT ROUTER IMPORT
import { useHistory } from 'react-router-dom'

// ===========================||  VIDEO PLAYER ||=========================== //

export const PlayerUIX = () => {
  const history = useHistory()

  return (
    <VideoPlayerContainer>
      <VideoPlayer
        titleMovie='Renfield'
        defaultVolume={50}
        src='http://vjs.zencdn.net/v/oceans.mp4'
        preview={false}
        onClose={() => history.push('/browse')}
        autoPlay={false}
      />
    </VideoPlayerContainer>
  )
}

export const VideoPlayerContainer = styled(Box)(() => ({
  width: '100%',
  height: '100vh'
}))

export default PlayerUIX
