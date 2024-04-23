// REACT IMPORTS
import React from "react";

// MUI IMPORTS
import {Box, styled} from "@mui/material";

// WATCHIT_UIX PACKAGE IMPORTS
import { VideoPlayer } from '@watchitapp/watchitapp-uix'

// REACT ROUTER IMPORT
import { useNavigate } from 'react-router-dom'

// ===========================||  VIDEO PLAYER ||=========================== //

export const PlayerUIX = () => {
  const navigate = useNavigate()

  return (
    <VideoPlayerContainer>
      <VideoPlayer
        titleMovie="Renfield"
        defaultVolume={50}
        src="http://vjs.zencdn.net/v/oceans.mp4"
        preview={false}
        onClose={() => navigate("/")}
        autoPlay={true}
      />
    </VideoPlayerContainer>
  )
}

export const VideoPlayerContainer = styled(Box)(() => ({
    width: '100%',
    height: 'calc(100vh - 2rem)'
}))

export default PlayerUIX
