import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const PlayerHeader = ({ title, children }) => {
    return (
        <Header>
            <Row>
                <Title variant="h4">
                    {title}
                </Title>
            </Row>
            <Box>{children}</Box>
        </Header>
    );
};

const Header = styled('header')({
    position: 'absolute',
    zIndex: 100,
    top: '2vh',
    left: '2vw',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

const Row = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const Title = styled(Typography)({
    color: 'white',
    fontWeight: 'bold',
    fontFamily: '"Open Sans", Arial, sans-serif',
});

export default PlayerHeader;
