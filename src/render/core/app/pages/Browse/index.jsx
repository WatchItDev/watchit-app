import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled, Box, Modal, TextField, Button, Typography } from '@mui/material';
import { ChannelsMenu, Logo } from '@watchitapp/watchitapp-uix';
import { MovieDetails } from '@components/MovieDetails';
import CatalogList from '@components/Catalog/list';
import log from '@logger';
import util from '@helpers/util';
import { DB, Broker as broker } from '@main/bridge';
import Search from "@components/Search";
import Stats from "@components/Stats";
import MoviePlayer from "@components/MoviePlayer";
import EmptyBlankSlate from "@components/EmptyBlankslate";
import Lottie from "lottie-react";
import loaderAnimation from "@render/media/img/loader.json";
import Filters from "@components/Filters";

const DEFAULT_INIT_LOAD = 100;

const yearRanges = {
  "Before 1900": [0, 1899],
  "1900s": [1900, 1909],
  "1910s": [1910, 1919],
  "1920s": [1920, 1929],
  "1930s": [1930, 1939],
  "1940s": [1940, 1949],
  "1950s": [1950, 1959],
  "1960s": [1960, 1969],
  "1970s": [1970, 1979],
  "1980s": [1980, 1989],
  "1990s": [1990, 1999],
  "2000s": [2000, 2009],
  "2010s": [2010, 2019],
  "2020s": [2020, 2029]
};

export const BrowserDesktop = () => {
  const [localDb, setLocalDb] = useState(null);
  const [moviesDb, setMoviesDb] = useState(null);
  const [collections, setCollections] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loadedMovies, setLoadedMovies] = useState([]);
  const [screen, setScreen] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [percent, setPercent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionCID, setNewCollectionCID] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const resizeTimeout = useRef(null);
  const moviesWrapper = useRef(null);
  const lastMovieLoadedRef = useRef(0);

  // Handle filter changes
  const handleYearChange = (event) => setYear(event.target.value);
  const handleGenreChange = (event) => setGenre(event.target.value);

  const onResetFilters = () => {
    if (!screen) return console.log('No screen...')

    setYear('');
    setGenre('');

    const moviesNewStructure = moviesToRow(movies, screen.chunkSize);
    setLoadedMovies(moviesNewStructure);
    setCount(movies.length);
  };

  useEffect(() => {
    if (!screen) return console.log('No screen...')

    if (!year && !genre) {
      const moviesNewStructure = moviesToRow(movies, screen.chunkSize);
      setLoadedMovies(moviesNewStructure);
      setCount(movies.length);
    } else {
      const filteredMovies = movies.filter((movie) => {
        const movieYear = movie?.meta?.year || 0;
        const movieGenre = movie?.meta?.genres || [];
        const [startYear, endYear] = yearRanges[year] || [0, Infinity];
        const yearMatches = movieYear >= startYear && movieYear <= endYear;
        const genreMatches = movieGenre.some(g => g === genre);

        return (!year || yearMatches) && (!genre || genreMatches);
      });
      const moviesNewStructure = moviesToRow(filteredMovies, screen.chunkSize);
      setLoadedMovies(moviesNewStructure);
      setCount(filteredMovies.length);
    }
  }, [year, genre, movies, screen]);

  const getRecalculatedScreen = (force = false) => {
    if (screen && !force) return screen

    const width = moviesWrapper.current?.offsetWidth;
    const height = moviesWrapper.current?.offsetHeight;
    const defaults = util.calcScreenSize({ width, height });
    log.info(`Recalculating Screen W:${width}, H:${height}`);
    setScreen(defaults);
    return defaults
  }

  const loadOrder = useCallback(async (start, to) => {
    if (loading || !hasMore) return;

    log.warn('Fetching movies')
    return new Promise(async (resolve) => {
      setLoading(true);
      const defaults = getRecalculatedScreen();
      const chunkSize = defaults.chunkSize;
      const startIndex = start * chunkSize;
      const end = to * chunkSize;
      const endIndex = movies.length < end ? movies.length : end;
      const newMovies = movies.slice(startIndex, endIndex);
      const moviesNewStructure = moviesToRow(newMovies, chunkSize);

      setLoadedMovies(moviesNewStructure);
      setLoading(false);
      lastMovieLoadedRef.current = endIndex;
      setHasMore(endIndex < count);
      resolve([...loadedMovies, ...moviesNewStructure]);
    });
  }, [loading, movies, count]);

  const moviesToRow = (_movies, l) => {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
        .map((_, n) => _movies.slice(n * l, n * l + l));
  };

  const updateOrInsert = async (db, item, collection) => {
    const existingItem = await db.get(item._id, collection);
    if (existingItem) {
      db.update({ _id: item._id }, item, {}, collection).then(() => {
        console.log(`Item ${item._id} updated in the database`)
      })
    } else {
      db.insert(item, collection).then(() => {
        console.log(`Item ${item._id} inserted into the database`);
      })
    }
  };

  const runIngest = async (db, cid, moviesFromDb) => {
    // console.log('run ingest')
    // console.log(db)
    // console.log(cid)
    // console.log(moviesFromDb)
    const existingItem = await db.exists(cid);
    const data = await db.getAllData(cid);

    // console.log('hello has data ingest')
    // console.log(data)
    // console.log(data.length)
    // console.log(existingItem)
    // console.log(existingItem && data.length)

    if (existingItem && data.length) return

    // console.log('ingest')
    // console.log(moviesFromDb)
    broker.removeAllListeners();
    broker.stopListeningIPC();
    broker.startListeningIPC();

    broker.on('notification', async (e, n) => {
      const movie = { ...n, _id: n.meta.id };
      // console.log('movie from db')
      // console.log(cid)
      // console.log(moviesFromDb)
      const moviesAreLoaded = moviesFromDb.length

      await updateOrInsert(db, movie, cid);

      // console.log('on collect movie')
      // console.log(moviesAreLoaded)
      // console.log(moviesFromDb.length)
      // console.log(movie.count)
      // console.log(movie.progress)

      !moviesAreLoaded && setCount(movie.count);
      !moviesAreLoaded && setPercent(movie.progress);

      if (movie.progress === 100 && !moviesAreLoaded) {
        loadMoviesFromDb(cid)
      }
    });

    broker.connect(cid);
  }

  const loadMoviesFromDb = async (collection) => {
    return new Promise(async (resolve) => {
      const db = DB.connect(collection)
      setMoviesDb(db)

      // console.log('clear collection')
      // console.log(collection)

      // db.clear('bafkreigryozzhq5q4fsof3odknebncmvuguxot5jdrfxtcmmqcypwid2qy')
      // db.clear('bafkreicyho2ul5ya74lrcwwowyufow7o53digtq5nhtb5ymjfgple7pr7q')
      // db.clear('bafkreieuhjq647j2tvrym4kdig4hvkau6nwvm5wf65lrr7kw54njmxspe4')
      // db.clear('local')

      const allMovies = await db.getAllData(collection);
      // console.log('hello load movies from db')
      // console.log(allMovies)
      // console.log(allMovies.length)

      if (allMovies.length) {
        setPercent(100);
        setMovies(allMovies);
        setCount(allMovies.length);
        loadOrder(0, 6);
      }

      resolve({ db, allMovies })
    })
  }

  useEffect(() => {
    (async () => {
      if (!localDb) return;

      const all = await localDb.getAllData('local')
      const collectionsStored = await localDb.get('collections', 'local')
      const selectedChannel = await localDb.get('selectedCollection', 'local')

      console.log('all local data')
      console.log(all)

      if (collectionsStored?.values?.length) {
        setCollections(collectionsStored.values.map((c) => c.cid))
        setSelectedCollection(collectionsStored.values[0].cid)
      }

      if (selectedChannel?.value) {
        setSelectedCollection(selectedChannel?.value)
      }
    })()
  }, [localDb])

  useEffect(() => {
    const defaults = getRecalculatedScreen();
    const chunkSize = defaults.chunkSize;
    const newLoadedMovies = moviesToRow(movies, chunkSize);
    setLoadedMovies(newLoadedMovies);
  }, [movies]);

  useEffect(() => {
    if (!selectedCollection) return;

    setMovies([])
    setLoadedMovies([])
    setCount(0)
    setPercent(0)
    setSelectedMovie(null)

    loadMoviesFromDb(selectedCollection).then((args) => {
      console.log('Finish load movies from db')
      console.log(args)

      runIngest(args.db, selectedCollection, args.allMovies).then(() => {
        console.log('Finish ingest')
      })
    });
  }, [selectedCollection]);

  const recalculateScreen = () => {
    setLoadedMovies((currMovies) => {
      if (!currMovies.length) return currMovies;
      const defaults = getRecalculatedScreen(true);
      const chunkSize = defaults.chunkSize;
      return moviesToRow(currMovies.flat(1), chunkSize);
    });
  };

  const handleResize = useCallback(() => {
    resizeTimeout.current && clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(recalculateScreen, 100);
  }, [loadedMovies]);

  useEffect(() => {
    setLocalDb(DB.connect('local'))

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      broker.stopListeningIPC();
    };
  }, []);

  const onMovieClick = (movie) => {
    console.log('on movie click')
    console.log(movie)
    setSelectedMovie(movie);
  };

  const onMoviePlay = (movie) => {
    console.log('on movie play')
    console.log(movie)
    setSelectedMovie(movie);
    setIsPlaying(true)
  };

  const onCloseMovieModal = () => {
    setSelectedMovie(null);
  };

  const onClosePlayer = () => {
    setSelectedMovie(null)
    setIsPlaying(false)
  };

  const onAddChannel = async () => {
    // console.log('on add channel')
    setShowNewCollection(true)
  }

  const onChannelClick = async (channel) => {
    // console.log('on channel click: ', channel)
    setSelectedCollection(channel)

    await updateOrInsert(localDb, {
      _id: 'selectedCollection',
      values: channel
    }, 'local');
  }

  const handleAddCollection = async () => {
    setSelectedCollection(null)
    const collections = await localDb.get('collections', 'local') || { values: [] };
    const newCollection = { cid: newCollectionCID };
    const collectionsArr = [newCollection, ...collections.values];

    // console.log('handle add collection')
    // console.log(collectionsArr)

    await updateOrInsert(localDb, {
      _id: 'collections',
      values: collectionsArr
    }, 'local')

    setCollections(collectionsArr.map((c) => c.cid))
    setSelectedCollection(newCollectionCID)
    setShowNewCollection(false)
    setNewCollectionCID('')
  }

  const onRemoveCollection = async (collection) => {
    await localDb.delete(collection);
    const collectionsStored = await localDb.get('collections', 'local') || { values: [] };
    const updatedCollections = collectionsStored.values.filter(c => c.cid !== collection);
    const selected = updatedCollections.length ? updatedCollections[0].cid : null;

    await updateOrInsert(localDb, {
      _id: 'collections',
      values: updatedCollections
    }, 'local');

    await updateOrInsert(localDb, {
      _id: 'selectedCollection',
      values: selected
    }, 'local');

    setCollections(updatedCollections.map((c) => c.cid));
    setSelectedCollection(selected);
  }

  const handleSignOut = async (el) => {
    console.log('handle click sign out')
    console.log(el)
  }

  // console.log(movies)
  // console.log(collections)
  // console.log(percent)

  return (
      <MainContainer>
        <ChannelsMenuWrapper>
          <Box sx={{ marginTop: '0.3rem' }}>
            <Logo size={50} />
          </Box>
          <ChannelsMenu
              channels={collections} selected={selectedCollection}
              onAddChannel={onAddChannel} onChannelClick={onChannelClick}
              onRemoveChannel={onRemoveCollection}
          />
        </ChannelsMenuWrapper>

        <MainContent ref={moviesWrapper}>
          { collections.length ? (
              <MainContentHeader>
                <Search movies={movies} onClick={onMovieClick} />
                <FiltersWrapper>
                  <Filters
                      year={year}
                      genre={genre}
                      onYearChange={handleYearChange}
                      onGenreChange={handleGenreChange}
                      onResetFilters={onResetFilters}
                  />
                  <Stats loaded={Math.ceil((percent/100)  * count)} count={count} onSignOut={handleSignOut} />
                </FiltersWrapper>
              </MainContentHeader>
          ) : <></> }
          { percent < 100 && collections.length ? (
              <LoaderWrapper>
                <Lottie animationData={loaderAnimation} loop autoPlay style={{width: 200, height: 200}} />
                <span style={{ marginLeft: '0.5rem' }}>{percent}%</span>
              </LoaderWrapper>
          ) : <></>}

          { !collections.length ? (
              <Box sx={{ width: '100%', height: '100%' }}>
                <EmptyBlankSlate />
              </Box>
          ) : <></> }

          {
              loadedMovies.length > 0 && !!screen && percent === 100 && selectedCollection && (
                  <CatalogList
                      cid={selectedCollection}
                      movies={loadedMovies}
                      loadOrder={loadOrder}
                      count={Math.ceil(count / (screen?.chunkSize ?? 6))}
                      loading={loading}
                      end={!hasMore}
                      chunkSize={screen.chunkSize}
                      onClick={onMovieClick}
                      onPlay={onMoviePlay}
                      screen={screen}
                  />
              )
          }
          {selectedMovie && !isPlaying && <MovieDetails movie={selectedMovie} onCloseModal={onCloseMovieModal} onPlay={onMoviePlay} />}
        </MainContent>

        {selectedMovie && isPlaying && <MoviePlayer movie={selectedMovie} onClose={onClosePlayer} />}

        <Modal open={showNewCollection} onClose={() => setShowNewCollection(false)}>
          <AddCollectionModalWrapper>
            <Typography>Add new collection</Typography>
            <TextField
                label="Collection CID"
                sx={{ marginY: 2, 'fieldset': { borderColor: '#fff' }, 'label, input': { color: '#fff' } }}
                value={newCollectionCID}
                onChange={(e) => setNewCollectionCID(e.target.value)}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddCollection}>
              Add Collection
            </Button>
          </AddCollectionModalWrapper>
        </Modal>
      </MainContainer>
  );
};

export const MainContainer = styled(Box)(() => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20'
}));

export const AddCollectionModalWrapper = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#212328',
  borderRadius: '1rem',
  boxShadow: 24,
  padding: '1rem',
}));

export const ChannelsMenuWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100%',
  maxWidth: '80px',
  minWidth: '80px',
  top: 0,
  left: 0,
  zIndex: '10',
  backgroundColor: '#1A1C20',
}));

export const MainContent = styled(Box)(() => ({
  width: 'calc(100% - 80px)',
  backgroundColor: '#212328',
  height: '100%',
  position: 'relative',
  border: '1px solid #444',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  }
}));

export const MainContentHeader = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#212328',
  padding: '0.5rem',
  borderBottom: '1px solid #444',
  marginBottom: '0.5rem',
  position: 'relative',
  zIndex: 10
}));

export const LoaderWrapper = styled(Box)(() => ({
  position: 'absolute',
  top: -55,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

const FiltersWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '1rem',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'flex-end'
}));

export default BrowserDesktop;
