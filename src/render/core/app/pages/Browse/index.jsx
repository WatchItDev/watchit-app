// REACT IMPORTS
import React, { useState, memo } from 'react'

// MUI IMPORTS
import { styled, Box, Typography } from '@mui/material'

// WATCHIT_UIX PACKAGE IMPORTS
import {
  Menu,
  MobileHeader,
  ProfileAvatar,
  ControllerSlider,
  ChannelsMenu,
} from '@watchitapp/watchitapp-uix'

// TABLER ICON IMPORTS
import NotificationsIcon from '@mui/icons-material/Notifications'

// PROJECT IMPORTS
import { MovieDetails } from '../../components/MovieDetails'

// TEST DATA IMPORTS
import { items, movies, channels } from '../../TempData'

// ===========================|| BROWSE - CONTAINER ||=========================== //

export const Browse = (props) => {
  const [active, setActive] = useState('1')
  const [isOpen, setIsOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const handleToggleOpen = () => setIsOpen(!isOpen)

  return (
    <React.StrictMode>
    <BrowseContainer>
      <HeaderContainer isOpen={isOpen}>
        <Box sx={{ height: '55px', width: '80px' }}>
          <ChannelsMenu isOpen={isOpen} users={channels} />
        </Box>
        <Menu
          onItemChange={setActive}
          active={active}
          isOpen={isOpen}
          onIsOpenChange={handleToggleOpen}
          items={items}
          width='255px'
        />
        <HeaderWrapper isOpen={isOpen}>
          <MobileHeader
            title='Browse'
            isActive={isOpen}
          />
          <Box 
            display='flex' justifyContent='end' 
            alignItems='center' style={{ padding: '0 1rem' }}
          >
            <NotificationsIcon style={{ color: '#D1D2D3', marginRight: '8px', flexShrink: 0 }} />
            <ProfileAvatar
              width={30} height={30} borderSize={2}
              userName='Jacob Peralta' rank='Platinum'
            />
          </Box>
        </HeaderWrapper>
      </HeaderContainer>

      <ControlSliderWrapper open={isOpen}>
        <ControllerSlider onClick={() => setOpenModal(true)} movies={movies} title='Continue Watching'  />
        <ControllerSlider onClick={() => setOpenModal(true)} movies={movies} title='Top rated' />
        <ControllerSlider onClick={() => setOpenModal(true)} movies={movies} title='Top rated' />
      </ControlSliderWrapper>

      {
        openModal &&
          <MovieDetails
            open={openModal}
            handleOnCloseModal={
              () => setOpenModal(false)
            }
          />
      }
    </BrowseContainer>
    </React.StrictMode>
  )
}

export const BrowseContainer = styled(Box)(() => ({
  height: '100vh',
  width: '100%',
  backgroundColor: '#212328'
}))

export const HeaderWrapper = styled(Box)((props) => ({
  width: 'calc(100% - 320px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: props.isOpen ? '#212328' : '#1A1C20'
}))

export const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => (prop !== 'isOpen')
})((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '65px',
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: '10',
  backgroundColor: props.isOpen ? '#212328' : '#1A1C20'
}))

export const MobileHeaderWrapper = styled(Box)((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '65px',
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: '10',
  backgroundColor: props.active ? '#212328' : '#1A1C20'
}))

export const ControlSliderWrapper = styled(Box)((props) => ({
  width: `${props.open ? 'calc(100% - 330px)' : '100%'}`,
  marginTop: '65px',
  transform: `translateX( ${props.open ? '330px' : '0'})`,
  transition: 'transform 250ms ease-in-out',
  padding: '1rem',
  backgroundColor: '#212328',
  overflowX: 'auto',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: "column",
  gap:'12px 0',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#FF0000'
  },
  //, width 1s ease-in-out
  // WebkitTransition:'width 1s ease-in-out',
  // MozTransition:'width 1s ease-in-out',
  // OTransition:'width 1s ease-in-out'
}))

export default Browse
