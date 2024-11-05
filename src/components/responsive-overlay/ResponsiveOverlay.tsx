import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Image from "@src/components/image";
import responsiveImage from '@public/assets/illustrations/working-responsive.png';

const ResponsiveOverlay = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isSmallScreen) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >

      <Image src={responsiveImage} alt="Watchit App" sx={{ width: 350}} />
      <Box sx={{ m: 4 }} />
      <Typography variant="h6">Watchit App</Typography>
      <Typography variant="h6">
        We are working on making this page responsive.
      </Typography>
    </Box>
  );
};

export default ResponsiveOverlay;
