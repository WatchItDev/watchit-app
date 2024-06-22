import React from 'react';
import styled from 'styled-components'
import { Box } from "@mui/material";

import Image from "@/renderer/package/components/Image";
import setting from "@/renderer/settings";
import './index.scss';

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

export default React.memo(Poster);
