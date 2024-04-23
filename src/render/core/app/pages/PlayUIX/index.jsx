// REACT IMPORTS
import React from "react";

// MUI IMPORTS
import { Box } from "@mui/material";

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
        defaultVolumen={50}
        src="http://vjs.zencdn.net/v/oceans.mp4"
        preview={false}
        onClose={() => navigate("/browse")}
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
