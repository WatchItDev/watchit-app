// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, styled } from '@mui/material';

// LOCAL IMPORTS
import Dots from '@/renderer/media/img/spinner/three-dots.svg'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const PointsLoader = styled(Box)(() => ({
    height: '0.8rem',
    width: '3rem',
    backgroundImage: `url(${Dots})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
}));

// ----------------------------------------------------------------------

export default React.memo(PointsLoader);
