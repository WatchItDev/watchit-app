import React, {  useState } from "react";
import { styled, Box, Typography } from "@mui/material";
import { VideoPlayer }  from '@zorrillosdev/watchit_uix'
import { useHistory } from 'react-router-dom'

export const PlayerUIX =(props)=> {
  const history = useHistory()

  return (
    <Box sx={{width:'100%',height:'100vh'}}>
      <VideoPlayer 
        titleMovie="Renfield"
        defaultVolumen={50}
        src="http://vjs.zencdn.net/v/oceans.mp4"
        preview={false}
        onClose={()=>history.push("/browse")}
        autoPlay={false}
      />
    </Box>
  )
}

export default PlayerUIX
