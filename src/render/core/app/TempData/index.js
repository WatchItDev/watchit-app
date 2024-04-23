import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { RoundProgress } from '@watchitapp/watchitapp-uix'
import { BrandSafari, ClockHour4, CalendarStats } from 'tabler-icons-react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Icon = () => <MenuIcon />
const Icon2 = () => <AccessTimeIcon />
const Icon3 = () => <FavoriteBorderIcon />

export const movies = [
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

export const items = [
  {
    id: '1',
    icon: <BrandSafari />,
    title: 'Browse',
    active: false,
    onClick: () => console.log('clicked menu item')
  },
  {
    id: '2',
    icon: <ClockHour4 />,
    title: 'Recent',
    active: false,
    onClick: () => console.log('clicked menu item')
  },
  {
    id: '3',
    icon: <CalendarStats />,
    title: 'Coming Soon',
    active: false,
    onClick: () => console.log('clicked menu item')
  },
  {
    id: '4',
    icon: <Icon3 />,
    title: 'Watch List',
    active: false,
    onClick: () => console.log('clicked menu item')
  }
]

export const profileInfoList = [
  {
    icon: <RoundProgress size={25} percentage={80} text='8' textSize={10} />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  },
  {
    icon: <RoundProgress size={25} percentage={80} text='8' textSize={10} />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  },
  {
    icon: <Icon2 />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  },
  {
    icon: <Icon2 />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  },
  {
    icon: <Icon2 />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  },
  {
    icon: <Icon2 />,
    title: '1h 28m',
    subTitle: 'Duration',
    handleOnClick: () => console.log('clicked profile info')
  }
]

export const channels = [
  'Austin',
  'Brooklyn',
  'Chicago'
]
