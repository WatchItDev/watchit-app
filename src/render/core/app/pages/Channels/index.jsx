// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { styled, Box, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// WATCHIT_UIX PACKAGE IMPORTS
import { Logo, ChannelItem, CustomButton } from '@zorrillosdev/watchit_uix'

// REACT ROUTER IMPORT
import { useHistory } from 'react-router-dom'

// TEST DATA IMPORTS
import { channels } from '../../TempData'

// ===========================|| CHANNELS - CONTAINER ||=========================== //

export const Channels = () => {
  const history = useHistory()

  return (
    <ChannelsContainer>
      <Box display='flex' sx={{ marginTop: '2rem' }}>
        <Logo size={150} />
      </Box>
      <ChannelsItemWrapper>
        <Grid container spacing={2} justifyContent='center'>
          {channels.map((channel, index) => {
            return (
              <Grid key={index} index={index} item xs={6} sm={3} md={3}>
                <ChannelItem
                  innerLetter={channel}
                  label={channel}
                  size={100}
                  labelLetterSize='0.8rem'
                  innerLetterSize={35}
                  selected={index === 0}
                  borderWidth={3}
                  onClick={() => history.push('/browse')}
                />
              </Grid>
            )
          })}
          <Grid 
            item xs={6} sm={3} md={3} 
            alignItems='start' 
            index={(channels.length)} 
          >
            <AddChannelWrapper>
              <CustomButton
                margin='5px'
                height='86px'
                width='91px'
                borderRadius='19px !important'
                icon={<AddIcon style={{ color: '#D1D2D3' }} />}
                variant='secondary'
                backgroundColor='transparent'
              />
            </AddChannelWrapper>
          </Grid>
        </Grid>
      </ChannelsItemWrapper>
      <Box display='flex' sx={{ marginBottom: '2rem' }}>
        <CustomButton variant='secondary' children={<span>MANAGE CHANNELS</span>} />
      </Box>
    </ChannelsContainer>
  )
}

export const ChannelsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#212328'
}))

export const ChannelsItemWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: '300px'
}))

export const AddChannelWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}))

export default Channels
