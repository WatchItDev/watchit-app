import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import setting from 'package.json';

const Footer = () => {
    return (
        <FooterWrapper>
            <Version>{setting.version}</Version>
        </FooterWrapper>
    );
};

export default React.memo(Footer);

// Styled Components
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
