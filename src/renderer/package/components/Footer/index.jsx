// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Box, styled, Typography } from '@mui/material'

// LOCAL IMPORTS
import setting from '#/package.json';

// ----------------------------------------------------------------------
// MAIN COMPONENT

const Footer = () => {
    return (
        <FooterWrapper>
            <Version>{setting.version}</Version>
        </FooterWrapper>
    );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const FooterWrapper = styled(Box)({
    height: 'auto',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    left: 0,
    bottom: 0,
    padding: '0.7rem 1rem',
});

const Version = styled(Typography)({
    color: '#999',
    letterSpacing: '2px',
    fontSize: '0.9rem',
    lineHeight: 1,
});

// ----------------------------------------------------------------------

export default React.memo(Footer);
