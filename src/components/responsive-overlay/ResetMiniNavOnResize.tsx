import { useState, useEffect } from 'react';
import {useSettingsContext} from "@src/components/settings";

const ResetMiniNavOnResize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const settings = useSettingsContext();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if(isSmallScreen && settings.themeLayout === 'mini') {
    settings.onUpdate('themeLayout', 'vertical');
  }

  if (!isSmallScreen) {
    return null;
  }
};

export default ResetMiniNavOnResize;
