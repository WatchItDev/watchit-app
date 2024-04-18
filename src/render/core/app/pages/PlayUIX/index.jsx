import React from "react";
import { Box } from "@mui/material";
import { VideoPlayer } from '@watchitapp/watchitapp-uix'
import { useNavigate } from 'react-router-dom'

export const PlayerUIX = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ width: '100%', height: '100vh' }}>
      <VideoPlayer
        titleMovie="Renfield"
        defaultVolumen={50}
        src="http://vjs.zencdn.net/v/oceans.mp4"
        preview={false}
        onClose={() => navigate("/browse")}
        autoPlay={false}
      />
    </Box>
  )
}

export default PlayerUIX
