import React from 'react';
import Image from '@components/Image/';
import PulseLoader from '@components/PulseLoader/';
import { Box, styled } from '@mui/material';

const CatalogPoster = ({ id, empty = true, end, onClick, image, preload, title, year, rating }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick && onClick(id);
  };

  return (
      <PosterWrapper>
        {empty && !end && <PulseLoader />}
        <PosterLink href='/#' onClick={handleClick} empty={empty}>
          <Image src={image ?? 'https://i0.wp.com/www.themoviedb.org/t/p/w185/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg'} preload={preload} />
          <HoverPosterBox>
            <HoverInfo>
              <Title>{title ?? ''}</Title>
              <InfoText>
                <i className='icon-calendar margin-right-3-p' />
                {year ?? ''}
              </InfoText>
              <InfoText>
                <i className='icon-star margin-right-2-p' />
                {rating ?? ''}
              </InfoText>
            </HoverInfo>
          </HoverPosterBox>
        </PosterLink>
      </PosterWrapper>
  );
};

const PosterWrapper = styled(Box)({
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  position: 'relative'
});

const PosterLink = styled('a')(({ empty }) => ({
  opacity: empty ? 0 : 1,
  pointerEvents: empty ? 'none' : 'all',
  textDecoration: 'none'
}));

const HoverPosterBox = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 1
  }
});

const HoverInfo = styled('div')({
  position: 'absolute',
  bottom: '1rem',
  left: '0.5rem',
  right: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
});

const Title = styled('strong')({
  color: 'white',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const InfoText = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: 'white'
});

export default CatalogPoster