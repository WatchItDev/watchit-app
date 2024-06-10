import React, { useRef, useState, useEffect } from 'react';
import { styled, Box } from '@mui/material';
import { ChannelsMenu, Logo } from '@watchitapp/watchitapp-uix';
import Details from '@components/MovieDetails';
import CatalogList from '@components/Catalog';
import MoviePlayer from "@components/MoviePlayer";
import EmptyBlankSlate from "@components/Blankslate";
import { DB as db } from '@main/bridge';

export default function MovieIndex() {
  const [collections, setCollections] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [isAdding, setIsAdding] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const moviesWrapper = useRef(null);

  const getCollectionDb = () => {
    return db.connect('collections');
  }

  const getStateDb = () => {
    return db.connect('state');
  }

  const handleMovieClick = (movieId) => {
    setSelectedMovie(movieId);
  };

  const handleMoviePlay = (movieId) => {
    setSelectedMovie(movieId);
    setIsPlaying(true);
  };

  const handleCloseMovie = () => {
    setSelectedMovie(null);
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
    setIsPlaying(false);
  };

  const handleAddChannel = () => {
    setIsAdding(true);
  };

  const handleChannelClick = async (channel) => {
    setSelectedCollection(channel);
    await getStateDb().insert({ _id: 'selected', value: channel });
  };

  const handleAddCollection = async (cid) => {
    const newEntry = { _id: cid }
    const collectionDb = getCollectionDb();
    await collectionDb.insert(newEntry);
    // insert new entry and update the collection list..
    setCollections((prevState) => ({ ...prevState, ...newEntry }));
    setSelectedCollection(cid);
    setIsAdding(false);
  };

  const onRemoveCollection = async (collectionId) => {
    const removedEntry = { _id: collectionId }
    const collectionDb = getCollectionDb();
    await collectionDb.delete(removedEntry);
    delete collections[collectionId];
    setCollections(collections);
  };


  // first run
  useEffect(() => {
    (async () => {
      const stateDb = getStateDb();
      const collectionDb = getCollectionDb();

      const collectionsFromDB = await collectionDb.all();
      const lastSelectedCollection = await stateDb.get('selected');
      const selected = lastSelectedCollection[0]?.value ?? collectionsFromDB[0]?._id

      setCollections(collectionsFromDB.map((el) => el._id));
      setSelectedCollection(selected);
      setIsAdding(!selected);
    })();
  }, []);


  const showCatalog = selectedCollection && !selectedMovie;
  const showDetails = selectedMovie && selectedCollection && !isPlaying;

  return (
    <MainContainer>
      <ChannelsMenuWrapper>
        <Box className={'hide-on-desktop'} sx={{ marginTop: '1rem' }}>
          <Logo size={50} />
        </Box>
        <ChannelsMenu
          channels={collections} selected={selectedCollection}
          onAddChannel={handleAddChannel} onChannelClick={handleChannelClick}
        />
      </ChannelsMenuWrapper>

      <MainContent ref={moviesWrapper} sx={{ borderTopLeftRadius: process.env.RUNTIME === 'web' ? '0' : '1rem' }}>
        {isAdding ? (
          <Box sx={{ width: '100%', height: '100%' }}>
            <EmptyBlankSlate onButtonClick={handleAddCollection} />
          </Box>
        ) : <></>}

        {
          showCatalog ? (
            <CatalogList
              cid={selectedCollection}
              onClickMovie={handleMovieClick}
              onPlayMovie={handleMoviePlay}
              onSignOut={onRemoveCollection}
            />
          ) : <></>
        }

        {
          showDetails ? (
            <Details
              id={selectedMovie}
              onClose={handleCloseMovie}
              onPlay={handleMoviePlay}
              cid={selectedCollection}
            />
          ) : <></>
        }
      </MainContent>

      {
        isPlaying && (
          <MoviePlayer
            id={selectedMovie}
            cid={selectedCollection}
            onClose={handleClosePlayer} />
        )
      }
    </MainContainer>
  );
};

export const MainContainer = styled(Box)(() => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20',
  position: 'relative'
}));

export const AddCollectionWrapper = styled(Box)(() => ({
  justifyContent: 'center',
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
  borderTopLeftRadius: '1rem',
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
  borderTopLeftRadius: '1rem',
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
