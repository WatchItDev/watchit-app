import React, { useRef, useState, useEffect } from 'react';
import { styled, Box } from '@mui/material';
import Logo from '@components/Logo/'
import Details from '@components/MovieDetails';
import CatalogList from '@components/Catalog';
import MoviePlayer from "@components/MoviePlayer";
import EmptyBlankSlate from "@components/Blankslate";
import ChannelsMenu from "@components/ChannelsMenu";
import BlockedBlankslate from "@components/BlockedBlankslate";
import { DB as db } from '@main/bridge';
import log from '@logger'

export default function MovieIndex() {
  const [collections, setCollections] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [isAdding, setIsAdding] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const moviesWrapper = useRef(null);

  const showCatalog = selectedCollection && !selectedMovie;
  const showDetails = selectedMovie && selectedCollection && !isPlaying;

  const getCollectionDb = () => {
    return db.connect('collections');
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
    setIsAdding(false);
  };

  const handleAddCollection = async (cid) => {
    const newEntry = { _id: cid }
    const collectionDb = getCollectionDb();
    await collectionDb.insert(newEntry);

    log.info(`New collection stored: ${cid}`)
    // insert new entry and update the collection list..
    setCollections((prevState) => (
      // if cid is not in prevState already..
      [...prevState, ...(!prevState.includes(cid) ? [cid] : [])]
    ));

    setSelectedCollection(cid);
    setIsAdding(false);
  };

  const onRemoveCollection = async (collectionId) => {
    await getCollectionDb().delete({ _id: collectionId });
    // filter the collection and avoid adding the removed to avoid re-slice..
    const newCollection = collections.filter((el)=> el != collectionId );
    setCollections(newCollection);
    setSelectedCollection(null);
    setIsAdding(true);
  };

  useEffect(() => {
    (async () => {
      const collectionsFromDB = await getCollectionDb().all();
      setCollections(collectionsFromDB.map((el) => el._id));
    })();
  }, [collections]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /mobile|android|iphone|ipad|tablet/i.test(userAgent);
    const isSmallScreen = window.innerWidth < 900;
    setIsBlocked(isMobileDevice || isSmallScreen);

    const handleResize = () => {
      setIsBlocked(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isBlocked) return <BlockedBlankslate />;

  return (
    <MainContainer>
      <ChannelsMenuWrapper>
        <Box className={'hide-on-desktop'} sx={{ marginTop: '1rem' }}>
          <Logo size={50} />
        </Box>
        <ChannelsMenu
            channels={collections}
            selected={selectedCollection}
            onAddChannel={handleAddChannel}
            onChannelClick={handleChannelClick}
        />
      </ChannelsMenuWrapper>

      <MainContent
        ref={moviesWrapper}
        sx={{
          borderTopLeftRadius: process.env.RUNTIME === 'web' ? '0' : '1rem'
        }}
      >
        {isAdding ? (
          <EmptyBlankSlate onButtonClick={handleAddCollection} />
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
