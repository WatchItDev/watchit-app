// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, Typography, ListItem, Icon, styled } from '@mui/material';

// LOCAL IMPORTS
import Image from '@/renderer/package/components/Image/'
import setting from '@/renderer/settings'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const SearchResultItem = (props) => {
  const handleClick = () => {
    props.onClick &&
    props.onClick(props._id)
  }

    return (
        <ResultWrapper onClick={handleClick}>
            <ImageWrapper className="slide-in-right">
                <Image src={props.image} preload pulseStyle={{ position: 'relative' }} />
            </ImageWrapper>
            <ResultContent>
                <ResultTitle>
                    {props.meta.title}
                </ResultTitle>
                <ResultDetails>
                    <ResultDetailsItem color={setting.styles.colors.successDark}>
                        <ResultDetailsItemIcon className="icon-calendar" />
                        {props.meta.year}
                    </ResultDetailsItem>
                    <ResultDetailsItem color={setting.styles.colors.warningDark}>
                        <ResultDetailsItemIcon className="icon-star" />
                        {props.meta.rating}
                    </ResultDetailsItem>
                    <ResultDetailsItem color={setting.styles.colors.dangerDark}>
                        <ResultDetailsItemIcon className="icon-back-in-time" />
                        {props.meta.runtime} m
                    </ResultDetailsItem>
                </ResultDetails>
            </ResultContent>
        </ResultWrapper>
    );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const ResultWrapper = styled(ListItem)(() => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    listStyleType: 'none',
    lineHeight: '1.5rem',
    padding: '10px 20px',
    margin: 0,
    borderBottom: '1px solid rgba(53, 60, 57, 0.4)',
    cursor: 'pointer',
}));

const ResultContent = styled(Box)(() => ({
    marginLeft: '1rem',
    maxWidth: 'calc(100% - 3rem)',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
}));

const ResultTitle = styled(Typography)(() => ({
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    whiteSpace: 'pre-wrap',
    '-webkit-box-orient': 'vertical',
    height: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontStyle: 'normal',
    fontSize: '1.2rem',
    wordBreak: 'break-all',
    color: '#FFF',
    fontWeight: 500,
}));

const ResultDetails = styled(Box)(() => ({
    marginTop: '0.4rem',
    display: 'flex',
    flexDirection: 'row'
}));

const ResultDetailsItem = styled(Typography)(({ color }) => ({
    fontSize: '1rem',
    marginRight: '1rem',
    color: color,
    display: 'flex',
    alignItems: 'center',
}));

const ResultDetailsItemIcon = styled(Icon)(({ color }) => ({
    fontSize: '1rem',
    marginRight: '0.3rem',
    color: color,
}));

const ImageWrapper = styled('figure')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    width: '2.5rem',
    transition: 'all 0.65s ease',
}));

// ----------------------------------------------------------------------

export default React.memo(SearchResultItem);
