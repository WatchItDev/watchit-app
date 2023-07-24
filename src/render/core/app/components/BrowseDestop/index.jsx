import React, {  useState } from "react";
import { styled, Box, Typography } from "@mui/material";
import { Menu } from '@zorrillosdev/watchit_uix'
import { MobileHeader } from '@zorrillosdev/watchit_uix'
import {ControllerSlider} from '@zorrillosdev/watchit_uix'
import { Menu2,BellRinging2 } from "tabler-icons-react";
import { ChannelsMenu }  from '@zorrillosdev/watchit_uix'

export const BrowseDestop =(props)=> {
  const [ active, setActive ] = useState('1')
  const [ isOpen, setIsOpen ] = useState(false)

  const movies = [
    {
      img:'https://cuevana3.mu/img/Mkp0NmxQeko2cXFxOVZVbDBLaEw5TTZpRmdEb1gzR1puSGVrN01RcE5QQzVpNUZFWHJDaFpHOUxDUStHd00xVQ.webp',
      title:'Renfield'
    },
    {
      img:'https://cuevana3.mu/img/SmV4UDhnZnJtd254dEk2YjQ5bm8vTzNwRTRNaU16NkJLMWJjbVVFVk02eHhQcGlwYy9NV1dUNFFsYzJWZG93cQ.webp',
      title:'Super Mario Bros: La Pelicula'
    },
    {
      img:'https://cuevana3.mu/img/b25UV3ZTaGpwNkQ2N05RMzZmQmsrSHlhUFJXN0pRMU5KcExXdDNOMGY3NnJJS3pTa0tDMGREb2hnU0wrbzJRYQ.webp',
      title:'Dungeons & Dragons: Honor entre ladrones'
    },
    {
      img:'https://cuevana3.mu/img/UUErRWRkQlZDY2JQNG0xSEVWM3ZFbWxuWG5QU3JmaGJHejhiUUZKaEVmcFcvV3djVTJzNEQvRG52emV5NTl1Qg.webp',
      title:'Misterio a la vista'
    },
    {
      img:'https://cuevana3.mu/img/YkRXS3VXV1lMdzZJMkF1dm5ZUEloSzh1T2gxR000RjBXWlhrZGUxbFQ0QXJ5T3BOMitCTGt4d0cxY2FNcU9IQQ.webp',
      title:'John Wick 4'
    },
    {
      img:'https://cuevana3.mu/img/M2tpS2s3elEvYjlnM2ZmOWdEUFhNRGtiSk4rMUR4cnRxZGhzRzliazQxekZVSUlxQmZ3R2xsODRSYTJ0Q0h2MA.webp',
      title:'¡Shazam! La furia de los dioses'
    },
    {
      img:'https://cuevana3.mu/img/a0tXYjhoY2tadm9OcEVxNXRiOThXMzZNMHN6Qnd4dnRhWCt1ZUlubTg1RmtPTFF5eXdHMXFVS2ZrckNPNW9KVQ.webp',
      title:'Ant-Man y la Avispa: Quantumanía'
    },
    {
      img:'https://cuevana3.mu/img/bVdLSU91UGlodmtGY28zREo3VVBON1Zlc2VLMXk4Ukp1SkU4Z2s0RXNvK2lqNUVTYlpHb1VaZnFiK3VFeXBUcw.webp',
      title:'The Devil Conspiracy'
    },
    {
      img:'https://cuevana3.mu/img/MmFFa2k2MXpqZVdaVmZDYk1XeEp1RFRSYUVKaCtCUGdoUWtxbnFnWjJNRFllcVFvR0V2cDhKMGFwVzVKZDg2TQ.webp',
      title:'Babylon'
    },
    {
      img:'https://cuevana3.mu/img/SXlYRTdoa3EwY0JIakw5dGxrTVJEb25YTGZCNmtWNG1mcVcxbFpvQjRQOEhwNkZOa3d1U2JuanJIeHg2MDF0QQ.webp',
      title:'Bodas de Plomo'
    },
    {
      img:'https://cuevana3.mu/img/bVpzc3pzU0lCK2x0aERxdG9hRWVHNzYwNjhIZzlyS2pOeXIzdG8zSjdoWE9KUjVZcjd6R0pYb3ZQSzFnWUxwNw.webp',
      title:'Operation Fortune: Ruse de Guerre'
    },
    {
      img:'https://cuevana3.mu/img/eDJScVR0TGRsZHNER0RWSkMzRzZxcGFzQk9jTG1zU3RvRWlwVlZXSGJuaXkyYTl4N2N1NmhFclJkYWxwSHptVQ.webp',
      title:'Avatar: El camino del agua'
    }
  ]
  const items = [
    {
      id: '1',
      icon: <Menu2 />,
      title: 'Browse',
      active: false,
      onClick: () => console.log('clicked menu item')
    },
    {
      id: '2',
      icon: <Menu2 />,
      title: 'Recent',
      active: false,
      onClick: () => console.log('clicked menu item')
    },
    {
      id: '3',
      icon: <Menu2 />,
      title: 'Coming Soon',
      active: false,
      onClick: () => console.log('clicked menu item')
    },
    {
      id: '4',
      icon: <Menu2 />,
      title: 'Watch List',
      active: false,
      onClick: () => console.log('clicked menu item')
    }
  ] 

  const handleToggleOpen = () => setIsOpen((open) => !open)
  
  return (
    <>
      <MobileHeaderWrapper isOpen={isOpen} >
        <Box sx={{height:'65px'}}>
          <ChannelsMenu isOpen={isOpen}/>
        </Box>
        <Menu 
          onItemChange={setActive} 
          active={active} 
          isOpen={isOpen} 
          onIsOpenChange={handleToggleOpen}
          items={items}
          width={'340px'}
        />
        <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <MobileHeader 
            title="Broswe"
            isActive={isOpen}
          />
          <Box display={'flex'} justifyContent={'end'} alignItems={'center'} style={{ padding:'0 2rem' }}>
          <BellRinging2 style={{ color: '#D1D2D3',transform: 'rotate(-45deg)',marginRight:'8px' }}/>  
          <AvatarWrapper>
          <Avatar>
              J
          </Avatar>
          </AvatarWrapper>
          <Box>
            <UserTitles fontSize={'14px'} fontWeight={'bold'}>Jacob Peralta</UserTitles>
            <UserTitles fontSize={'10px'} fontWeight={'regular'}>Platinum</UserTitles>
          </Box>
        </Box>
        </Box>
      </MobileHeaderWrapper> 

      <ControlSliderWrapper open={isOpen}>
        <ControllerSlider movies={movies} title="Continue watching"/>
        <ControllerSlider movies={movies} title="Top rated"/>
      </ControlSliderWrapper>
    </>
  )
}

export const MobileHeaderWrapper = styled(Box)((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '65px',
  position:"fixed",
  width:'100%',
  top:0,
  left:0,
  zIndex:'10',
  backgroundColor: props.active ? '#212328' : '#1A1C20',
}))

export const UserTitles = styled(Typography)((props) => ({
    fontSize: `${props.fontSize}`,
    fontWeight: `${props.fontWeight}`,
    color: '#D1D2D3',
    margin: '0'
})) 

export const ControlSliderWrapper = styled(Box)((props) => ({
  width: `${ props.open ? 'calc(100% - 380px)' : '100%'}`,
  marginTop:'72px',
  transform: `translateX( ${ props.open ? '380px' : '0' })`,
  transition: 'transform 250ms ease-in-out',
  //,width 1s ease-in-out
  //WebkitTransition:'width 1s ease-in-out',
  //MozTransition:'width 1s ease-in-out',
  //OTransition:'width 1s ease-in-out'
}))

export const Avatar = styled(Box)(() => ({
  width: '30px',
  height: '30px',
  backgroundColor: 'orange',
  borderRadius: '50%',
  color:'white',
  fontWeight: 'bold',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderImage: 'conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red) 1'
}))

export const AvatarWrapper = styled(Box)(() => ({
  width: '45px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'double 8px transparent',
  borderRadius: '80px',
  backgroundImage: 'radial-gradient(circle at top left, #f00,#3020ff)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  margin:'0 0.1rem 0 0.5rem',
}))

export default BrowseDestop
