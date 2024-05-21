import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled, Box, Modal, TextField, Button, Typography } from '@mui/material';
import { ChannelsMenu } from '@watchitapp/watchitapp-uix';
import { MovieDetails } from '@components/MovieDetails';
import CatalogList from '@components/Catalog/list';
import log from '@logger';
import util from '@helpers/util';
import { DB, Broker as broker } from '@main/bridge';

const DEFAULT_INIT_LOAD = 100;

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
  const [count, setCount] = useState(DEFAULT_INIT_LOAD);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionCID, setNewCollectionCID] = useState('');
  const resizeTimeout = useRef(null);
  const moviesWrapper = useRef(null);
  const lastMovieLoadedRef = useRef(0);

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

      setLoadedMovies((prevMovies) => [...prevMovies, ...moviesNewStructure]);
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

  const updateOrInsertMovie = async (db, movie, collection) => {
    const existingMovie = await db.get(movie._id);
    if (existingMovie) {
      db.update({ _id: movie._id }, movie, {}, collection).then(() => {
        console.log(`Movie ${movie._id} updated in the database`)
      })
    } else {
      db.insert(movie, collection).then(() => {
        console.log(`Movie ${movie._id} inserted into the database`);
      })
    }
  };

  const runIngest = async (db, cid, moviesFromDb) => {
    // console.log('run ingest')
    // console.log(db)
    // console.log(cid)
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

      await updateOrInsertMovie(db, movie, cid);

      // console.log('on collect movie')
      // console.log(moviesAreLoaded)
      // console.log(moviesFromDb.length)
      // console.log(movie.count)
      // console.log(movie.progress)

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

      // const all = await localDb.getAllData('local')
      const collectionsStored = await localDb.get('collections', 'local')
      const selectedChannel = await localDb.get('selectedCollection', 'local')

      // console.log('all local data')
      // console.log(all)

      if (collectionsStored?.values) {
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

  const recalculateScreen = useCallback(() => {
    if (!loadedMovies.length) return;
    const defaults = getRecalculatedScreen(true);

    setLoadedMovies((currMovies) => {
      const chunkSize = defaults.chunkSize;
      return moviesToRow(currMovies.flat(1), chunkSize);
    });
  }, [loadedMovies]);

  const handleResize = useCallback(() => {
    resizeTimeout.current && clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(recalculateScreen, 500);
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
    setSelectedMovie(movie);
  };

  const onCloseMovieModal = () => {
    setSelectedMovie(null);
  };

  const onAddChannel = async () => {
    // console.log('on add channel')
    setShowNewCollection(true)
  }

  const onChannelClick = async (channel) => {
    // console.log('on channel click: ', channel)
    setSelectedCollection(channel)

    await localDb.insert({
      _id: 'selectedCollection',
      value: channel
    }, 'local')
  }

  const handleAddCollection = async () => {
    setSelectedCollection(null)
    const collections = await localDb.get('collections', 'local') || { values: [] };
    const newCollection = { cid: newCollectionCID };
    const collectionsArr = [newCollection, ...collections.values];

    // console.log('handle add collection')
    // console.log(collectionsArr)

    // SET MOCKED COLLECTION
    await localDb.insert({
      _id: 'collections',
      values: collectionsArr
    }, 'local')

    setNewCollectionCID('')
    setCollections(collectionsArr.map((c) => c.cid))
    setSelectedCollection(newCollectionCID)
    setShowNewCollection(false)
  }


  // console.log(movies)
  // console.log(collections)
  // console.log(percent)

  return (
      <MobileHeaderContainer>
        <MobileHeaderWrapper isOpen={true} >
          <ChannelsMenu
              channels={collections} selected={selectedCollection}
              onAddChannel={onAddChannel} onChannelClick={onChannelClick}
          />
        </MobileHeaderWrapper>

        <ControlSliderWrapper open={true} ref={moviesWrapper}>
          { percent < 100 && collections.length ? (
              <span>Loading {percent}%</span>
          ) : <></> }

          { !collections.length ? (
              <span>Hey add a collection!</span>
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
                      screen={screen}
                  />
              )
          }
        </ControlSliderWrapper>

        {selectedMovie && <MovieDetails movie={selectedMovie} OnCloseModal={onCloseMovieModal} />}

        <Modal open={showNewCollection} onClose={() => setShowNewCollection(false)}>
          <ModalWrapper>
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
          </ModalWrapper>
        </Modal>
      </MobileHeaderContainer>
  );
};

export const MobileHeaderContainer = styled(Box)(() => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20'
}));

export const ModalWrapper = styled(Box)(() => ({
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
  padding: 4,
}));

export const MobileHeaderWrapper = styled(Box, {
  shouldForwardProp: (prop) => (prop !== 'isOpen')
})((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '100%',
  maxWidth: '80px',
  minWidth: '80px',
  top: 0,
  left: 0,
  zIndex: '10',
  backgroundColor: props.active ? '#212328' : '#1A1C20',
}));

export const ControlSliderWrapper = styled(Box, {
  shouldForwardProp: (prop) => (prop !== 'open')
})((props) => ({
  width: '100%',
  backgroundColor: '#212328',
  height: '100%',
  borderTopLeftRadius: '1rem',
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
