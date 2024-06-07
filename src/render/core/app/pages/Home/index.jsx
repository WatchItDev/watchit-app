import React, { useRef, useState } from 'react';
import { styled, Box } from '@mui/material';
import { ChannelsMenu, Logo } from '@watchitapp/watchitapp-uix';

import Details from '@components/MovieDetails';
import CatalogList from '@components/Catalog';
import MoviePlayer from "@components/MoviePlayer";
import EmptyBlankSlate from "@components/Blankslate";


export default function MovieIndex() {
  const [collections, setCollections] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const moviesWrapper = useRef(null);

  const onMovieClick = (movieId) => {
    setSelectedMovie(movieId);
  };

  const onMoviePlay = (movieId) => {
    setSelectedMovie(movieId);
    setIsPlaying(true)
  };

  const onCloseMovie = () => {
    setSelectedMovie(null);
  };

  const onClosePlayer = () => {
    setSelectedMovie(null)
    setIsPlaying(false)
  };

  const onAddChannel = () => {
    // console.log('on add channel')
    setSelectedCollection(null)
  }

  const onChannelClick = (channel) => {
    setSelectedCollection(channel)
  }

  const handleAddCollection = (cid) => {
    setSelectedCollection(cid)
  }

  const onRemoveCollection = (collection) => {

  }

  return (
    <MainContainer>
      <ChannelsMenuWrapper>
        <Box className={'hide-on-desktop'} sx={{ marginTop: '0.3rem' }}>
          <Logo size={50} />
        </Box>
        <ChannelsMenu
          channels={collections} selected={selectedCollection}
          onAddChannel={onAddChannel} onChannelClick={onChannelClick}
          onRemoveChannel={onRemoveCollection}
        />
      </ChannelsMenuWrapper>

      <MainContent ref={moviesWrapper} sx={{ borderTopLeftRadius: process.env.RUNTIME === 'web' ? '0' : '1rem' }}>
        {!selectedCollection ? (
          <Box sx={{ width: '100%', height: '100%' }}>
            <EmptyBlankSlate onButtonClick={handleAddCollection} />
          </Box>
        ) : <></>}

        {
          selectedCollection && !selectedMovie ? (
            <CatalogList
              cid={selectedCollection}
              onClickMovie={onMovieClick}
              onPlayMovie={onMoviePlay}
            />
          ) : <></>
        }

        {
          selectedMovie && (
            <Details
              id={selectedMovie}
              onClose={onCloseMovie}
              onPlay={onMoviePlay}
              cid={selectedCollection}
            />
          )
        }
      </MainContent>

      {
        isPlaying && (
          <MoviePlayer
            id={selectedMovie}
            cid={selectedCollection}
            onClose={onClosePlayer} />
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


