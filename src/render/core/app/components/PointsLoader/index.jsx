import React from 'react';
import Dots from '@render/media/img/spinner/three-dots.svg';
import { Box, styled } from '@mui/material';

const PointsLoader = styled(Box)(() => ({
    height: '0.8rem',
    width: '3rem',
    backgroundImage: `url(${Dots})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
}));

export default React.memo(PointsLoader);
