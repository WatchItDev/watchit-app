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

// MAIN BRIDGE
import { Key as key, Broker as broker } from '@main/bridge'
import storage from "@helpers/storage";

const DEFAULT_INIT_LOAD = 100

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
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [state, setState] = useState('Bootstrapping')
  const [percent, setPercent] = useState(0)
  const [peers, setPeers] = useState(0)
  const [count, setCount] = useState(DEFAULT_INIT_LOAD)
  const [scrolling, setScrolling] = useState(false)
  const [lock, setLock] = useState(false)
  const [finishLoad, setFinishLoad] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(false)
  const [logout, setLogout] = useState(false)
  const renderTimeout = useRef(null)
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

    log.warn('Fetching movies from db')
    return new Promise((resolve) => {

      // Throttling
      renderTimeout.current && clearTimeout(renderTimeout.current)
      renderTimeout.current = setTimeout(() => {
        filterMovies({
              ...{
                start,
                to
              },
              ...{
                sort_by: 'year',
                order: 'desc'
              }
              // ...sort
            },
            false, false, (state) => {
              log.info('Infinite movies loaded')
              resolve(state)
            }
        )
      }, 500)

      // TODO: FAKE!!
      // Simula la carga de datos
      // setLoading(true);
      // setTimeout(() => {
      //   const defaults = getRecalculatedScreen()
      //   const chunkSize = defaults.chunkSize
      //   const startIndex = start * chunkSize;
      //   const end = to * chunkSize;
      //   const endIndex = fakeMovies.length < end ? fakeMovies.length : end;
      //   const newMovies = fakeMovies.slice(startIndex, endIndex);
      //   const moviesNewStructure = moviesToRow(newMovies, chunkSize)
      //
      //   setMovies((prevMovies) => [...prevMovies, ...moviesNewStructure]);
      //   setLoading(false);
      //   lastMovieLoadedRef.current = endIndex;
      //   setHasMore(endIndex < fakeMovies.length);
      //   resolve([...movies,...moviesNewStructure])
      // }, 1000);
    })
  };

  const moviesToRow = (_movies, l) => {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
        .map((_, n) => _movies.slice(n * l, n * l + l))
  }

  const chaos = () => {
    // Wait for redirect to app login
    log.warn('Redirecting...')
    setTimeout(() => { window.location.href = '#/' }, 0)
  }

  const runIngest = () => {
    // Init ingest
    // broker.removeAllListeners().on('progress', (state) => {
    //   setState(state)
    // }).on('start', async () => {
    //   log.info('STARTING')
    //   // if (!loaded) localStorage.clear();
    // }).on('ready', () => {
    //   // Start filtering set cache synced movies
    //   log.info('LOADED FROM LOCAL')
    //   startRunning()
    // }).on('error', (msg = 'Waiting Network') => {
    //   if (ready) return
    //   setState(msg)
    //   setReady(false)
    // }).on('done', () => {
    //   log.info('LOAD DONE')
    // }).on('chaos', chaos).load()
  }

  const filterMovies = (filter = {}, clear = false, chunks = null, cb = null) => {
    if (logout) { return false } // Nothing to fetch. Go out!!

    // Get from cache filters
    if (storage.get().from.mainNavFilters()) {
      filter = { ...filter, ...storage.get().from.mainNavFilters() }
    }

    // Clean all... invalid
    if ('genres' in filter) {
      if (filter.genres === 'All') {
        delete filter.genres
      }
    }

    // Add limit to filters
    filter = { ...{ limit: screen.limit }, ...filter }
    if ('to' in filter && 'start' in filter) {
      filter.limit = filter.to - filter.start
      filter.skip = filter.start
      log.info('Skip:', filter.skip)
      log.info('Chunk:', filter.limit)
    }

    // Get movies
    // movie.filter(filter).then((movies) => {
    //   // Chunk and concat movies
    //   log.warn('Movies filtered')
    //   const _chunk = chunks || screen.chunkSize
    //   const _movies = moviesToRow(movies, _chunk)
    //
    //   // Handle sizes
    //   const size = _movies.length
    //   const newMovies = [...movies, ..._movies]
    //   const current = newMovies.length
    //
    //   setScrolling(false)
    //   setLoading(false)
    //   setCount(!size ? current : (current + 10))
    //   setFinishLoad(!clear ? !size : false)
    //   setMovies(clear ? _movies : newMovies)
    //   setLock(false)
    //
    //   // Send state in cb
    //   cb && cb(state)
    // })
  }

  const recalculateScreen = useCallback(() => {
    if (!movies.length) return
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
    // Add resize event listener
    window.addEventListener('resize', handleResize)

    // const itCached = getCached() || getLoaded()
    // setLoading(!itCached)
    // setReady(itCached)

    broker.startListeningIPC()
    broker.on('notification', (e) => {
      console.log('Hello notification!!!!!!!!')
      console.log(e)
    })

    broker.connect('bafkreibec3yptircaamjhg6vox5vzxn5am6c773nnye4nnmvzbxovp2nt4')

    // Start ingest if not
    // if (getCached()) {
    //   log.info('Running Cache')
    //   return
    // }

    // Start ingestion
    runIngest()

    loadOrder(0, 6)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      broker.stopListeningIPC()
    }
  }, []);

  // const _index = (i) => {
  //   // Else try get from key file and save
  //   const _storage = key.readFromStorage() || {}
  //   return (i in _storage && _storage[i]) || 0
  // }
  //
  // const getLoaded = () => {
  //   return +_index('chunk') > 0
  // }
  //
  // const getCached = () => {
  //   return _index('cached')
  // }

  const startRunning = (cb = null) => {
    if (logout) return
    setReady(true)
    setLoading(false)

    cb?.()
  }

  const onMovieClick = (id) => {
    setSelectedMovie(id)
    setLock(true)
    setOpenModal(true)
  }

  const onCloseMovieModal = () => {
    setSelectedMovie(null)
    setLock(false)
    setOpenModal(false)
  }

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
                    // count={Math.ceil(fakeMovies?.length / (screen?.chunkSize ?? 6))}
                    count={count}
                    loading={loading}
                    end={!hasMore}
                    chunkSize={screen.chunkSize}
                    onClick={onMovieClick}
                    screen={screen}
                />
            )
        }
      </ControlSliderWrapper>

      {openModal && <MovieDetails OnCloseModal={onCloseMovieModal} />}
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
