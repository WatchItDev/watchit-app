import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openMinibar, removeMinibar } from '@src/redux/minibar';
import { BREAKPOINTS_MINIBAR } from '@src/layouts/config-layout.ts';

const ResetMiniNavOnResize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      setIsSmallScreen(screenWidth < BREAKPOINTS_MINIBAR.MIN);

      // Only dispatch if the screen size has changed when the screen is small that 1600
      if (
        screenWidth > BREAKPOINTS_MINIBAR.MIN &&
        screenWidth < BREAKPOINTS_MINIBAR.MAX
      ) {
        dispatch(openMinibar());
      }

      // If greater than 1600, close the minibar
      if (screenWidth > BREAKPOINTS_MINIBAR.MAX) {
        dispatch(removeMinibar());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  if (!isSmallScreen) {
    return null;
  }
};

export default ResetMiniNavOnResize;
