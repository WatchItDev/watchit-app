// REACT IMPORTS
import React, { useCallback, useEffect, useRef, useState } from 'react'

// MUI IMPORTS
import { styled, Box } from '@mui/material'

// UIX IMPORTS
import { MobileHeader, ChannelsMenu } from '@watchitapp/watchitapp-uix'

// PROJECT IMPORTS
import { MovieDetails } from '@components/MovieDetails'
import CatalogList from '@components/Catalog/list'
import log from '@logger'
import util from '@helpers/util'

const generateFakeMovies = (count) => {
  let movies = [];
  for (let i = 0; i < count; i++) {
    movies.push({
      _id: i,
      image: `https://i0.wp.com/www.themoviedb.org/t/p/w185/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg`,
      title: `Movie Title ${i}`,
      year: `Year ${2000 + i}`,
      rating: 1 + (i % 5)
    });
  }
  return movies;
};

const fakeMovies = generateFakeMovies(1000)

export const BrowserDesktop = () => {
  const isOpen= true
  const [openModal, setOpenModal] = useState(false)
  const [movies, setMovies] = useState([])
  const [screen, setScreen] = useState(undefined)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const resizeTimeout = useRef(null)
  const moviesWrapper = useRef(null);
  const lastMovieLoadedRef = useRef(0);

  const channels = [
    'Austin',
    'Brooklyn',
    'Chicago'
  ]

  const getRecalculatedScreen = () => {
    const width = moviesWrapper.current.offsetWidth
    const height = moviesWrapper.current.offsetHeight
    const defaults = util.calcScreenSize({
      width,
      height
    })
    log.info(`Recalculating Screen W:${width}, H:${height}`)
    return defaults
  }

  const loadOrder = async (start, to) => {
    if (loading || !hasMore) return;
    return new Promise((resolve) => {
      setLoading(true);

      // Simula la carga de datos
      setTimeout(() => {
        const defaults = getRecalculatedScreen()
        const chunkSize = defaults.chunkSize
        const startIndex = start * chunkSize;
        const end = to * chunkSize;
        const endIndex = fakeMovies.length < end ? fakeMovies.length : end;
        const newMovies = fakeMovies.slice(startIndex, endIndex);
        const moviesNewStructure = moviesToRow(newMovies, chunkSize)

        setMovies((prevMovies) => [...prevMovies, ...moviesNewStructure]);
        setLoading(false);
        lastMovieLoadedRef.current = endIndex;
        setHasMore(endIndex < fakeMovies.length);
        resolve([...movies,...moviesNewStructure])
      }, 1000);
    })
  };

  const moviesToRow = (_movies, l) => {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
        .map((_, n) => _movies.slice(n * l, n * l + l))
  }

  const recalculateScreen = useCallback(() => {
    // if (!this.state.movies.length) return
    const defaults = getRecalculatedScreen()

    setMovies((currMovies) => {
      const defaults = getRecalculatedScreen()
      const chunkSize = defaults.chunkSize

      return moviesToRow(currMovies.flat(1), chunkSize)
    })
    setScreen(defaults)
  }, [movies])

  const handleResize = useCallback(() => {
    resizeTimeout.current && clearTimeout(resizeTimeout.current)
    resizeTimeout.current = setTimeout(recalculateScreen, 500)
  }, [movies])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    loadOrder(0, 6)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

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

      <ControlSliderWrapper open={isOpen} ref={moviesWrapper}>
        {
            movies.length > 0 && !!screen && (
                <CatalogList
                    movies={movies}
                    loadOrder={loadOrder}
                    count={Math.ceil(fakeMovies?.length / (screen?.chunkSize ?? 6))}
                    loading={loading}
                    end={!hasMore}
                    chunkSize={screen.chunkSize}
                    onClick={() => setOpenModal(true)}
                    screen={screen}
                />
            )
        }
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
  backgroundColor: '#212328',
  height: '100%',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
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
