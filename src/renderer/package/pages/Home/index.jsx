// REACT IMPORTS
import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';

// MUI IMPORTS
import { styled, Box } from '@mui/material';

// LOCAL IMPORTS
import Logo from '@/renderer/package/components/Logo'
import Details from '@/renderer/package/components/MovieDetails';
import MainLoader from '@/renderer/package/components/MainLoader';
import CatalogList from '@/renderer/package/components/Catalog';
import MoviePlayer from "@/renderer/package/components/MoviePlayer";
import EmptyBlankSlate from "@/renderer/package/components/Blankslate";
import ChannelsMenu from "@/renderer/package/components/ChannelsMenu";
import OpenCollective from '@/renderer/media/img/layout/openCollective.png'
import BlockedBlankslate from "@/renderer/package/components/BlockedBlankslate";
import { Context } from '@/renderer/package/runtime/context'
import log from '@/main/logger'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const runtime = import.meta.env.WATCHIT_RUNTIME
export default function MovieIndex() {
  const context = useContext(Context)
  const [collections, setCollections] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const moviesWrapper = useRef(null);

  const showCatalog = selectedCollection && !selectedMovie;
  const showDetails = selectedMovie && selectedCollection && !isPlaying;

  const getCollectionDb = () => {
    return context.db.connect('collections');
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

  const handleAddCollection = useCallback(
    async (cid) => {
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
    }, []);

  const onRemoveCollection = async (collectionId) => {
    // filter the collection and avoid adding the removed to avoid re-slice..
    // setIsLoading(true);
    const newCollection = collections.filter((el) => el != collectionId);
    await getCollectionDb().delete({ _id: collectionId });
    setCollections(newCollection);
    setSelectedCollection(null);
    setIsAdding(true);
    // setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      const collectionsFromDB = await getCollectionDb().all();
      setCollections(collectionsFromDB.map((el) => el._id));
      setIsLoading(false)
    })();
  }, []);

  if (isLoading)
    return <MainLoader />

  return (
    <>
      <BlockedBlankslateWrapper>
        <BlockedBlankslate />
      </BlockedBlankslateWrapper>
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
          <Box
              sx={{
                marginTop: 'auto', display: 'flex', padding: '1rem',
                width: '100%', alignItems: 'center', justifyContent: 'center'
              }}
          >
            <OpenCollectiveLogo
                src={OpenCollective}
                alt="OpenCollective"
                onClick={() => window.open('https://opencollective.com/watchit', '_blank')}
            />
          </Box>
        </ChannelsMenuWrapper>

        <MainContent
            ref={moviesWrapper}
            sx={{
              borderTopLeftRadius: runtime === 'browser' ? '0' : '1rem'
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
    </>
  );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const BlockedBlankslateWrapper = styled(Box)(() => ({
  display: 'none',
  height: '100%',
  width: '100%',
  '@media (max-width: 900px)': {
    display: 'flex'
  }
}));

export const MainContainer = styled(Box)(() => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20',
  position: 'relative',
  '@media (max-width: 900px)': {
    display: 'none'
  }
}));

export const AddCollectionWrapper = styled(Box)(() => ({
  justifyContent: 'center',
  width: 400,
  backgroundColor: '#212328',
  borderRadius: '1rem',
  boxShadow: 24,
  padding: '1rem',
}));

const OpenCollectiveLogo = styled('img')(() => ({
  marginTop: 'auto',
  width: '70%',
  opacity: 0.5,
  cursor: 'pointer',
  transition: 'opacity 0.3s, transform 0.3s',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.2)',
  }
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
  // border: '1px solid #444',
  overflow: 'hidden',
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
