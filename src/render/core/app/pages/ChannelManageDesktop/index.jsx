import React from "react";
import { useNavigate } from 'react-router-dom'

import { Add } from "@mui/icons-material";
import { styled, Box, Grid } from "@mui/material";
import { Logo, ChannelItem, CustomButton }  from '@watchitapp/watchitapp-uix'

export const ChannelManageDesktop = () => {
  const users = [ 'Austin', 'Brooklyn','Chicago']
  const navigate = useNavigate()
  
  return (
    <ChannelManageDesktopWrapper>
      <Box sx={{ display: 'flex',marginTop:'2rem' }}>
        <Logo size={150}/>
      </Box>
      <Box sx={{ display: 'flex',alignItems:'center',minWidth:'300px' }}>
        <Grid container justifyContent={'center'} spacing={2}>
          { users.map( (user, index) => {
            return(
              <Grid index={index} item xs={6} sm={3} md={3} key={index}>
                <ChannelItem 
                  innerLetter={user} 
                  label={user} 
                  size={100} 
                  labelLetterSize={'0.8rem'}
                  innerLetterSize={35} 
                  selected={index == 0 ? true : false} 
                  borderWidth={3}
                  onClick={()=>navigate("/browse")}
                />
              </Grid>
            )
          })}
          <Grid alignItems={'start'} index={(users.length)} item xs={6} sm={3} md={3}>
            <AddChannelWrapper>
              <CustomButton 
                margin="5px" 
                height="86px" 
                width="91px" 
                borderRadius="19px !important" 
                icon={<Add style={{ color: '#D1D2D3' }}/>} 
                variant={'secondary'} 
                backgroundColor={'transparent'} 
              />
            </AddChannelWrapper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex',marginBottom:'2rem' }}>
        <CustomButton  variant={'secondary'} children={<span>MANAGE CHANNELS</span>} />
      </Box>
    </ChannelManageDesktopWrapper>
  )
}

export const ChannelManageDesktopWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  height:'calc(100vh)',
  backgroundColor: '#212328'
}))

export const AddChannelWrapper = styled(Box)(() => ({
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  cursor:'pointer',
}))

/* const CustomGrid = styled(Grid)<CustomGridProps>(({index, theme},) => ({
  [theme.breakpoints.only('xs')]: {
    display:'flex',
    justifyContent:`${ (index%2) > 0 ? 'start' : 'end'}`
  }
})); */

export default ChannelManageDesktop
