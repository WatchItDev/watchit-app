// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Box, Typography, styled, keyframes } from "@mui/material";

// LOCAL IMPORTS
import Image from "@/renderer/package/components/Image";
import setting from "@/renderer/settings";

// ----------------------------------------------------------------------
// MAIN COMPONENT

export const Poster = (props) => {
    if (props.empty) {
        return <StyledPoster itemWidth={props?.screen?.itemWidth} itemHeight={props?.screen?.itemHeight} />;
    }

    return (
        <StyledPoster itemWidth={props?.screen?.itemWidth} itemHeight={props?.screen?.itemHeight} onClick={() => props.onClick(props._id)}>
            <StyledCardImage className="card__image">
                <Image src={props.image} preload />
            </StyledCardImage>
            <StyledCardBody className="card__body">
                <StyledCardName className="card__name card--slide-in-top" variant="h3">
                    <span>{props.meta.title}</span>
                </StyledCardName>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    sx={{ width: '100%', bottom: 0, left: 0, p: 1 }}
                >
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        sx={{ width: '100%', margin: '0.5rem 0' }}
                    >
                        <StyledResultDetailsItem className="card--slide-in-left" color={setting.styles.colors.successDark}>
                            {props.meta.year}
                        </StyledResultDetailsItem>
                        <StyledResultDetailsItem className="card--fade-in" color={setting.styles.colors.warningDark}>
                            {props.meta.rating} / 10
                        </StyledResultDetailsItem>
                        <StyledResultDetailsItem className="card--slide-in-right" color={setting.styles.colors.dangerDark}>
                            {props.meta.runtime} m
                        </StyledResultDetailsItem>
                    </Box>
                    <StyledCardDesc className="card__desc card--slide-in-bottom">
                        {props.meta?.synopsis}
                    </StyledCardDesc>
                </Box>
            </StyledCardBody>
        </StyledPoster>
    );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const zoom = keyframes`
  from {
    object-position: 0 50%;
  }
  to {
    object-position: 100% 50%;
  }
`;

const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;


const StyledPoster = styled(Box)(({ theme, itemWidth, itemHeight }) => ({
    width: `${itemWidth}px`,
    height: `${itemHeight}px`,
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.65s ease',
    '&:hover .card__image img': {
        opacity: 0.4,
        transform: 'scale(1.3, 1.3)',
        filter: 'blur(3px)',
    },
    '&:hover .card__name': {
        background: 'linear-gradient(white, #c1c1c1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    '&:hover .card--slide-in-bottom': {
        animation: `${slideInBottom} 0.65s ease forwards`,
    },
    '&:hover .card--slide-in-top': {
        animation: `${slideInTop} 0.65s ease forwards`,
    },
    '&:hover .card--slide-in-left': {
        animation: `${slideInLeft} 0.65s ease forwards`,
    },
    '&:hover .card--slide-in-right': {
        animation: `${slideInRight} 0.65s ease forwards`,
    },
    '&:hover .card--fade-in': {
        animation: `${fadeIn} 0.65s ease forwards`,
    }
}));

const StyledCardImage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5))',
    '& img': {
        transition: 'all 0.65s ease',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        animation: `${zoom} 30s alternate infinite linear`,
    }
}));

const StyledCardBody = styled(Box)(({ theme }) => ({
    height: '100%',
    padding: '0 0.3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledCardName = styled(Typography)(({ theme }) => ({
    alignSelf: 'center',
    justifySelf: 'center',
    width: '100%',
    color: 'white',
    fontSize: '1.375rem',
    fontWeight: 100,
    letterSpacing: '0.1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    background: 'linear-gradient(white, #a1a1a1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'all 0.65s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.2rem',
    marginTop: 0,
    opacity: 0,
    '& span': {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.5rem',
    }
}));

const StyledCardDesc = styled(Typography)(({ theme }) => ({
    fontSize: '0.875em',
    fontWeight: 100,
    color: 'rgba(255, 255, 255, 1)',
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    margin: '0.5rem 0 0 0',
    textAlign: 'left',
    opacity: 0
}));

const StyledResultDetailsItem = styled(Typography)(({ color }) => ({
    color,
    opacity: 0
}));

// ----------------------------------------------------------------------

export default React.memo(Poster);
