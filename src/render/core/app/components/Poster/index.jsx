import React from 'react';
import './index.scss';
import { Box, Chip, Stack, Button, styled } from "@mui/material";
import { RoundProgress } from "@watchitapp/watchitapp-uix";
import Image from "@components/Image";

const primaryRateColors = {
    'success': '#037015',
    'warning': '#f59e0b',
    'danger': '#ef4444'
};

const secondaryRateColors = {
    'success': '#81ba83',
    'warning': '#fef3c7',
    'danger': '#fee2e2'
};

const getColorByRate = (rate) => {
    if (rate < 4) return 'danger';
    if (rate >= 7) return 'success';
    return 'warning';
};

export const Poster = (props) => {
    const color = getColorByRate(props?.rate ?? 1);

    if (props.empty) return <Box sx={{ width: props.width, height: props.height }} />

    const onPlay = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.onPlay();
    };

    const handleClick = (event) => {
        if (event.target.closest('.play-button')) {
            return;
        }
        props.onClick();
    };

    return (
        <Box className="card" data-effect="zoom" sx={{ width: props.width, height: props.height }} onClick={handleClick}>
            <figure className="card__image">
                <Image src={props.image} preload pulseStyle={{ position: 'relative' }} />
            </figure>
            <div className="card__body">
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}
                     sx={{width: '100%', marginTop: '0.5rem'}}>
                    <div className="card--slide-in-left">
                        <RoundProgress
                            text={`${props.rate}`}
                            percentage={((props.rate ?? 0) / 10) * 100}
                            progressBackgroundColor={secondaryRateColors[color]}
                            progressBarColor={primaryRateColors[color]}
                            textColor={secondaryRateColors[color]}
                            size={30}
                        />
                    </div>
                    <p className="card__year card--slide-in-right">{props.movie?.meta?.year}</p>
                </Box>
                <h3 className="card__name card--slide-in-top">
                  <span>
                    {props.title}
                  </span>
                </h3>
                <Stack direction="row" spacing={1} className={'card--fade-in'}>
                    {props.movie?.meta?.genres?.slice(0, 2).map((g, i) => {
                        return <Chip key={`chip-${props.movie._id}-${i}`} label={g} sx={{borderColor: '#fff', color: '#fff', opacity: 0.7}} variant="outlined"
                                     size="small"/>
                    })}
                </Stack>
                <p className="card__desc card--slide-in-bottom">{props.movie?.meta?.synopsis}</p>
                <GradientBorderButton
                    className={'play-button card--slide-in-bottom'}
                    onClick={onPlay}
                >
                    Watch IT
                </GradientBorderButton>
            </div>
        </Box>
    );
};

const GradientBorderButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    padding: '0.5rem 1.5rem',
    color: theme.palette.common.white,
    backgroundColor: 'transparent',
    fontWeight: 700,
    width: '100%',
    marginTop: '0.5rem',
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

export default Poster;
