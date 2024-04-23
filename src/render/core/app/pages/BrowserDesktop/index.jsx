// REACT IMPORTS
import React, { useState } from "react";

// MUI IMPORTS
import { styled, Box, Typography } from "@mui/material";

// UIX IMPORTS
import { MobileHeader } from '@watchitapp/watchitapp-uix'
import { ControllerSlider } from '@watchitapp/watchitapp-uix'
import { ChannelsMenu } from '@watchitapp/watchitapp-uix'

// PROJECT IMPORTS
import { MovieDetails } from "@components/MovieDetails";

export const BrowserDesktop = () => {
  const isOpen= true
  const [openModal, setOpenModal] = useState(false)

  const movies = [
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Renfield'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Super Mario Bros: La Pelicula'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Dungeons & Dragons: Honor entre ladrones'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Misterio a la vista'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'John Wick 4'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: '¡Shazam! La furia de los dioses'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Ant-Man y la Avispa: Quantumanía'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'The Devil Conspiracy'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Babylon'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Bodas de Plomo'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Operation Fortune: Ruse de Guerre'
    },
    {
      img: 'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg',
      title: 'Avatar: El camino del agua'
    }
  ]

  const channels = [
    'Austin',
    'Brooklyn',
    'Chicago'
  ]

  return (
    <MobileHeaderContainer>
      <MobileHeaderWrapper isOpen={isOpen} >
        <Box sx={{ height: '55px', width: '80px' }}>
          <ChannelsMenu isOpen={isOpen} users={channels} />
        </Box>
        <BrowseBarWrapper sx={{ backgroundColor: isOpen ? '#212328' : '#1A1C20' }}>
          <MobileHeader
            title="Browse"
            isActive={isOpen}
          />
        </BrowseBarWrapper>
      </MobileHeaderWrapper>

      {/* TODO make a list of movies instead this slider */}
      <ControlSliderWrapper open={isOpen}>
        <ControllerSlider onClick={() => setOpenModal(true)} movies={movies} title="Continue watching" />
      </ControlSliderWrapper>

      {openModal && <MovieDetails OnCloseModal={() => setOpenModal(false)} />}
    </MobileHeaderContainer>
  )
}

export const MobileHeaderContainer = styled(Box)(() => ({
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20'
}))

export const MobileHeaderWrapper = styled(Box, {
  shouldForwardProp: (prop) => (prop !== 'isOpen')
})((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '65px',
  // position: "fixed",
  width: '100%',
  top: 0,
  left: 0,
  zIndex: '10',
  backgroundColor: props.active ? '#212328' : '#1A1C20',
}))

export const ControlSliderWrapper = styled(Box, {
  shouldForwardProp: (prop) => (prop !== 'open')
})((props) => ({
  width: `${props.open ? 'calc(100% - 82px)' : '100%'}`,
  marginTop: '2px',
  transform: `translateX( ${props.open ? '80px' : '0'})`,
  transition: 'transform 250ms ease-in-out',
  padding: '1rem',
  backgroundColor: '#212328',
  overflowX: 'auto',
  maxHeight: '100vh',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  },
  "&::-webkit-scrollbar-thumb": {
    background: '#FF0000'
  }
}))

export const BrowseBarWrapper = styled(Box)(() => ({
  width: 'calc(100% - 80px)',
  borderTopLeftRadius: '1rem',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export default BrowserDesktop
