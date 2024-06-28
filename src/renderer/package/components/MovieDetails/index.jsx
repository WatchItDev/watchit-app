// REACT IMPORTS
import React, { useState, useEffect, useContext, memo } from 'react'

// MUI IMPORTS
import { styled, Box, Grid, Button, Typography } from '@mui/material';

// LOCAL IMPORTS
import Image from "@/renderer/package/components/Image";
import MainLoader from '@/renderer/package/components/MainLoader';
import VideoModal from "@/renderer/package/components/VideoModal";
import CustomScrollbars from '@/renderer/package/components/Scroller'
import ButtonClose from "@/renderer/package/components/ButtonClose";
import { Context } from '@/renderer/package/runtime/context'
import gateway from '@/renderer/gateway'

// ----------------------------------------------------------------------
// MAIN COMPONENT

export const MovieDetails = (props) => {
  const context = useContext(Context)
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    (async () => {
      const connectedDb = context.db.connect(props.cid)
      const movies = await connectedDb.get(props.id)

      setMovie(movies)
      setReady(true);
    })()
  }, [props.id])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    return (
        (!ready && <MainLoader />) || (
            <MovieDetailsContainer>
                <MovieDetailsWrapper>
                    <ButtonClose onClose={props.onClose} />
                    <StyledGrid container>
                        <StyledWrapperGrid>
                            <StyledInnerGrid container spacing={2}>
                                <Grid
                                    item
                                    xs={12}
                                    md={7}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        pb: 2,
                                        position: 'relative',
                                        zIndex: 2,
                                        height: '100%',
                                    }}
                                >
                                    <Grid container spacing={1} sx={{ padding: '1rem 2rem', position: 'relative', width: '100%' }}>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem', marginBottom: '0.5rem' }}
                                        >
                                            <StyledGenres variant="body1" className="slide-in-left">
                                                {movie?.meta?.genres?.join('  |  ').toUpperCase()}
                                            </StyledGenres>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                                            <StyledTitle variant="h3" className="slide-in-top">
                                                {movie.meta.title}
                                            </StyledTitle>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                padding: '0 1rem',
                                                marginTop: '0.5rem',
                                                gap: '1rem',
                                            }}
                                            className="slide-in-right"
                                        >
                                            <StyledDetail variant="body1">{movie?.meta?.year}</StyledDetail>
                                            <StyledDetail variant="body1">|</StyledDetail>
                                            <StyledDetail variant="body1">{movie?.meta?.runtime} min</StyledDetail>
                                            <StyledDetail variant="body1">|</StyledDetail>
                                            <StyledDetail variant="body1">{movie?.meta?.language?.toUpperCase()}</StyledDetail>
                                            <StyledDetail variant="body1">|</StyledDetail>
                                            <StyledDetail variant="body1">{movie?.meta?.rating} / 10</StyledDetail>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'start',
                                                justifyContent: 'center',
                                                padding: '0 1rem',
                                                maxHeight: 'auto',
                                                overflow: 'auto',
                                                marginTop: '0.5rem',
                                            }}
                                            className="slide-in-left"
                                        >
                                            <CustomScrollbars
                                                autoHide
                                                autoHeight
                                                autoHeightMax={400}
                                                autoHideTimeout={1000}
                                                autoHideDuration={200}
                                                thumbMinSize={20}
                                                universal
                                            >
                                                <StyledSynopsis variant="body1" className="slide-in-left">
                                                    {movie?.meta?.synopsis}
                                                </StyledSynopsis>
                                            </CustomScrollbars>
                                        </Grid>
                                        <ButtonBox className="slide-in-bottom" sx={{ width: { xs: '100%', sm: '75%', md: '50%' } }}>
                                            {/*{movie?.meta?.trailerUrl ? (*/}
                                            {/*    <ButtonTrailer onClick={handleOpen}>Trailer</ButtonTrailer>*/}
                                            {/*) : null}*/}
                                            <GradientBorderButton onClick={() => props.onPlay(movie?._id)}>Watch IT</GradientBorderButton>
                                        </ButtonBox>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={5}
                                    sx={{
                                        display: 'flex',
                                        position: 'relative',
                                        zIndex: 2,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: '0',
                                        height: '100%',
                                    }}
                                    // className="slide-in-right"
                                >
                                    <DetailImage>
                                        <Image src={gateway.parse(movie.images['large'])} preload />
                                    </DetailImage>
                                </Grid>
                            </StyledInnerGrid>
                        </StyledWrapperGrid>
                        <BackgroundGradientBox top="-130%" left="-50%" height="170%" width="150%" />
                        <BackgroundGradientBox top="0" left="-75%" height="170%" width="175%" />
                        <BackgroundGradientBox top="40%" left="-50%" height="170%" width="150%" />
                        <BackgroundDetailImage>
                            <Image src={gateway.parse(movie.images['medium'])} />
                        </BackgroundDetailImage>
                    </StyledGrid>
                </MovieDetailsWrapper>
                <VideoModal videoId={movie?.meta?.trailerUrl} open={open} handleClose={handleClose} />
            </MovieDetailsContainer>
        )
    );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const GradientBorderButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    padding: '0.5rem 1.5rem',
    color: theme.palette.common.white,
    backgroundColor: 'transparent',
    fontWeight: 700,
    width: '100%',
    marginTop: '1rem',
    borderRadius: '2rem',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        padding: '2px', // Adjust the padding to control the border width
        background: 'linear-gradient(45deg, rgb(248,244,135), rgb(53,176,182))',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const ButtonTrailer = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    padding: '0.5rem 1.5rem',
    color: theme.palette.common.white,
    backgroundColor: 'transparent !important',
    fontWeight: 700,
    width: '100%',
    marginTop: '1rem',
    borderRadius: '2rem',
    border: '2px solid #ff0200'
}));

const MovieDetailsContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    zIndex: '97',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: '#22232a',
    overflow: 'hidden',
}));

const MovieDetailsWrapper = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    zIndex: '10',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    '&::-webkit-scrollbar': {
        width: '0',
        background: 'transparent '
    },
    "&::-webkit-scrollbar-thumb": {
        background: 'transparent'
    }
}));

const StyledGrid = styled(Grid)(() => ({
    zIndex: '99',
    height: '100%',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledWrapperGrid = styled(Grid)(() => ({
    boxSizing: 'border-box',
    flexFlow: 'wrap',
    marginTop: '-16px',
    width: 'calc(100% + 16px)',
    marginLeft: '-16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% + 16px)',
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0px, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.3) 90%, rgba(0, 0, 0, 0) 100%)'
}))

const StyledInnerGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% + 16px)',
    [theme.breakpoints.down(600)]: {
        '.movie__name': {
            fontSize: '1.5rem',
        },
        '.movie__year': {
            fontSize: '1rem !important',
        },
        '.movie__text': {
            fontSize: '1rem !important',
        },
        maxWidth: '100%',
    },
    [theme.breakpoints.between(601, 960)]: {
        '.movie__name': {
            fontSize: '2rem',
        },
        '.movie__year': {
            fontSize: '1.1rem !important',
        },
        '.movie__text': {
            fontSize: '1.1rem !important',
        },
        maxWidth: '600px',
    },
    [theme.breakpoints.between(961, 1790)]: {
        '.movie__name': {
            fontSize: '3rem',
        },
        '.movie__year': {
            fontSize: '1.2rem !important',
        },
        '.movie__text': {
            fontSize: '1.2rem !important',
        },
        maxWidth: '1100px',
    },
    [theme.breakpoints.up(1791)]: {
        '.movie__name': {
            fontSize: '3.4rem',
        },
        '.movie__year': {
            fontSize: '1.5rem !important',
        },
        '.movie__text': {
            fontSize: '1.5rem !important',
        },
        maxWidth: '1200px',
    },
}));

const DetailImage = styled('figure')(({ theme }) => ({
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    width: '60%',
    minHeight: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    transition: 'all 0.65s ease',
    [theme.breakpoints.down(600)]: {
        width: 'auto',
    },
    [theme.breakpoints.between(601, 960)]: {
        width: '60%',
    },
    [theme.breakpoints.between(961, 1790)]: {
        width: '75%',
    },
    [theme.breakpoints.up(1791)]: {
        width: '100%',
    },
}));

const BackgroundDetailImage = styled('figure')({
    position: 'absolute',
    margin: 0,
    top: 0,
    right: 0,
    zIndex: -1,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
    pointerEvents: 'none',
    transition: 'all 0.65s ease',
    background: 'linear-gradient(to bottom, rgb(0, 0, 0), rgba(0, 0, 0, 0.5))',
    '& img': {
        opacity: 0.4,
        transform: 'scale(1.3, 1.3)',
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'all 0.65s ease',
        animation: 'zoom 10s alternate linear infinite',
        filter: 'blur(10px)',
    },
});

const BackgroundGradientBox = styled(Box)(() => ({
    zIndex: '1',
    position: 'absolute',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.7) 22%, rgba(0, 0, 0, 0) 100%)',
}));

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    marginTop: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
    fontFamily: '"Open Sans", Arial, sans-serif',
    alignSelf: 'center',
    justifySelf: 'center',
    margin: 0,
    width: '100%',
    color: 'white',
    fontWeight: 100,
    letterSpacing: '0.1rem',
    textAlign: 'left',
    textTransform: 'uppercase',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
    background: '-webkit-linear-gradient(white, #a1a1a1)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    transition: 'all 0.65s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    '& span': {
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1,
    },
    [theme.breakpoints.down(600)]: {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.between(601, 960)]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.between(961, 1790)]: {
        fontSize: '3rem'
    },
    [theme.breakpoints.up(1791)]: {
        fontSize: '3.4rem'
    },
}));

const StyledGenres = styled(Typography)(({ theme }) => ({
    color: '#FFF',
    fontWeight: 500,
    fontFamily: '"Open Sans", Arial, sans-serif',
    letterSpacing: '2px',
    fontSize: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    [theme.breakpoints.down(600)]: {
        fontSize: '1rem !important'
    },
    [theme.breakpoints.between(601, 960)]: {
        fontSize: '1.1rem !important'
    },
    [theme.breakpoints.between(961, 1790)]: {
        fontSize: '1.2rem !important'
    },
    [theme.breakpoints.up(1791)]: {
        fontSize: '1.5rem !important'
    },
}));

const StyledDetail = styled(Typography)(({ theme }) => ({
    fontFamily: '"Open Sans", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.2rem',
    fontWeight: '500',
    transition: 'all 0.65s ease',
    [theme.breakpoints.down(600)]: {
        fontSize: '1rem !important'
    },
    [theme.breakpoints.between(601, 960)]: {
        fontSize: '1.1rem !important'
    },
    [theme.breakpoints.between(961, 1790)]: {
        fontSize: '1.2rem !important'
    },
    [theme.breakpoints.up(1791)]: {
        fontSize: '1.5rem !important'
    },
}))

const StyledSynopsis = styled(Typography)(({ theme }) => ({
    fontFamily: '"Open Sans", Arial, sans-serif',
    position: 'relative',
    fontSize: '1.2rem',
    fontWeight: 100,
    color: 'rgba(255, 255, 255, 0.8)',
    display: '-webkit-box',
    margin: '0.5rem 0 0 0',
    opacity: 0.7,
    lineHeight: 1.3,
    transition: 'all 0.65s ease',
    [theme.breakpoints.down(600)]: {
        fontSize: '1rem !important',
    },
    [theme.breakpoints.between(601, 960)]: {
        fontSize: '1.1rem !important',
    },
    [theme.breakpoints.between(961, 1790)]: {
        fontSize: '1.2rem !important',
    },
    [theme.breakpoints.up(1791)]: {
        fontSize: '1.5rem !important',
    },
}))

// ----------------------------------------------------------------------

export default memo(MovieDetails);
