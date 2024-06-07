import React from 'react';
import './index.scss';
import { Box, Button, styled } from "@mui/material";
import { RoundProgress } from "@watchitapp/watchitapp-uix";
import Image from "@components/Image";
import PulseLoader from "@components/PulseLoader";

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

    if (props.empty)
        return <Box sx={{
            width: `${props?.screen?.itemWidth}px`,
            height: `${props?.screen?.itemHeight}px`
        }} />

    if (props.empty && !props.end) return (
        <Box sx={{
            width: `${props?.screen?.itemWidth}px`,
            height: `${props?.screen?.itemHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <PulseLoader />
        </Box>
    )

    return (
        <Box
            className="card"
            data-effect="zoom"
            onClick={() => props.onClick(props._id)}
            sx={{
                width: `${props?.screen?.itemWidth}px`,
                height: `${props?.screen?.itemHeight}px`
            }}
        >
            <figure className="card__image">
                <Image src={props.image} preload pulseStyle={{ position: 'relative' }} />
            </figure>
            <div className="card__body">
                <h3 className="card__name card--slide-in-top">
                    <span>
                        {props.meta.title}
                    </span>
                </h3>

                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    sx={{ width: '100%', bottom: 0, left: 0, p: 1 }}
                >
                    <Box
                        display={'flex'} alignItems={'center'}
                        justifyContent={'space-between'}
                        sx={{ width: '100%', margin: '0.5rem 0' }}
                    >
                        <div className={`card--slide-in-left`}>
                            {`${props.meta.rating ?? 0} / 10`}
                        </div>
                        <div className="card--slide-in-right">
                            {props.meta.year}
                        </div>
                    </Box>
                    <p className="card__desc card--slide-in-bottom">
                        {props.meta?.synopsis}
                    </p>
                </Box>
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
