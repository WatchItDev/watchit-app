import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled, Box } from '@mui/material';
import { MobileHeader, ChannelsMenu } from '@watchitapp/watchitapp-uix';
import { MovieDetails } from '@components/MovieDetails';
import CatalogList from '@components/Catalog/list';
import log from '@logger';
import util from '@helpers/util';
import { DB as db, Broker as broker } from '@main/bridge';

const DEFAULT_INIT_LOAD = 100;

const cid = 'bafkreigryozzhq5q4fsof3odknebncmvuguxot5jdrfxtcmmqcypwid2qy';

export const BrowserDesktop = () => {
  const isOpen= true;
  const [movies, setMovies] = useState([]);
  const [loadedMovies, setLoadedMovies] = useState([]);
  const [screen, setScreen] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [percent, setPercent] = useState(0);
  const [count, setCount] = useState(DEFAULT_INIT_LOAD);
  const [selectedMovie, setSelectedMovie] = useState();
  const resizeTimeout = useRef(null);
  const moviesWrapper = useRef(null);
  const lastMovieLoadedRef = useRef(0);

  const channels = [
    'Austin',
    'Brooklyn',
    'Chicago'
  ];

  const getRecalculatedScreen = () => {
    const width = moviesWrapper.current.offsetWidth;
    const height = moviesWrapper.current.offsetHeight;
    const defaults = util.calcScreenSize({ width, height });
    log.info(`Recalculating Screen W:${width}, H:${height}`);
    return defaults;
  };

  const loadOrder = useCallback(async (start, to) => {
    if (loading || !hasMore) return;

    log.warn('Fetching movies')
    return new Promise((resolve) => {
      setLoading(true);
      const defaults = getRecalculatedScreen();
      const chunkSize = defaults.chunkSize;
      const startIndex = start * chunkSize;
      const end = to * chunkSize;
      const endIndex = movies.length < end ? movies.length : end;
      const newMovies = movies.slice(startIndex, endIndex);
      const moviesNewStructure = moviesToRow(newMovies, chunkSize);

      setLoadedMovies((prevMovies) => [...prevMovies, ...moviesNewStructure]);
      setLoading(false);
      setScreen(defaults);
      lastMovieLoadedRef.current = endIndex;
      setHasMore(endIndex < count);
      resolve([...loadedMovies, ...moviesNewStructure]);
    });
  }, [loading, movies]);

  const moviesToRow = (_movies, l) => {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
        .map((_, n) => _movies.slice(n * l, n * l + l));
  };

  const runIngest = (cid) => {
    const cursor = db.connect(cid);
    broker.removeAllListeners();
    broker.startListeningIPC();

    broker.on('notification', async (e, n) => {
      const movie = { ...n, id: n.meta.id };

      await cursor.insert(movie);

      setMovies((prevMovies) => [...prevMovies, movie]);
      setPercent(movie.progress);
      setCount(movie.count);

      if (movie.progress === 100) {
        loadOrder(0, 6);
      }
    });

    broker.connect(cid);
  };

  useEffect(() => {
    const defaults = getRecalculatedScreen();
    const chunkSize = defaults.chunkSize;
    const newLoadedMovies = moviesToRow(movies, chunkSize);
    setLoadedMovies(newLoadedMovies);
    setScreen(defaults);
  }, [movies]);

  const recalculateScreen = useCallback(() => {
    if (!loadedMovies.length) return;
    const defaults = getRecalculatedScreen();

    setLoadedMovies((currMovies) => {
      const chunkSize = defaults.chunkSize;
      return moviesToRow(currMovies.flat(1), chunkSize);
    });
    setScreen(defaults);
  }, [loadedMovies]);

  const handleResize = useCallback(() => {
    resizeTimeout.current && clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(recalculateScreen, 500);
  }, [loadedMovies]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    runIngest(cid);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      broker.stopListeningIPC();
    };
  }, []);

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
    setLock(true);
  };

  const onCloseMovieModal = () => {
    setSelectedMovie(null);
    setLock(false);
  };

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
          { percent < 100 ? (
              <span>Loading</span>
          ) : <></> }
          {
              loadedMovies.length > 0 && !!screen && percent === 100 && (
                  <CatalogList
                      movies={loadedMovies}
                      loadOrder={loadOrder}
                      count={Math.ceil(count / (screen?.chunkSize ?? 6))}
                      loading={loading}
                      end={!hasMore}
                      chunkSize={screen.chunkSize}
                      onClick={onMovieClick}
                      screen={screen}
                  />
              )
          }
        </ControlSliderWrapper>

        {selectedMovie && <MovieDetails movie={selectedMovie} OnCloseModal={onCloseMovieModal} />}
      </MobileHeaderContainer>
  );
};

export const MobileHeaderContainer = styled(Box)(() => ({
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20'
}));

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
}));

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
}));

export const BrowseBarWrapper = styled(Box)(() => ({
  width: 'calc(100% - 80px)',
  borderTopLeftRadius: '1rem',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

export default BrowserDesktop;
