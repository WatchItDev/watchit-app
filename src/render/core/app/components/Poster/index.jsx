import React from 'react';
import { Box, Button, styled } from "@mui/material";
import Image from "@components/Image";
import PulseLoader from "@components/PulseLoader";
import './index.scss';

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

const ResultDetailsItem = styled.span`
  font-size: 1rem;
  color: ${props => props.color};
`

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
                <Image src={props.image} preload />
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
                        <ResultDetailsItem className={'card--slide-in-left'} color={setting.styles.colors.successDark}>
                        <div className={`card--slide-in-left`}>
                            {props.meta.rating ?? 0}
                        </div>
                        <div className={`card--slide-in-top`}>
                            {props.meta.runtime}
                        </div>
                        <div className="card--slide-in-right">
                            {props.meta.year}
                        </ResultDetailsItem>
                        <ResultDetailsItem className={'card--fade-in'} color={setting.styles.colors.warningDark}>
                            {props.meta.rating} / 10
                        </ResultDetailsItem>
                        <ResultDetailsItem className={'card--slide-in-right'} color={setting.styles.colors.dangerDark}>
                            {props.meta.runtime} m
                        </ResultDetailsItem>
                    </Box>
                    <p className="card__desc card--slide-in-bottom">
                        {props.meta?.synopsis}
                    </p>
                </Box>
            </div>
        </Box>
    );
};

export default Poster;
