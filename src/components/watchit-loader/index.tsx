import { FC, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
// eslint-disable-next-line import/no-extraneous-dependencies
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import watchitLogo from '@src/assets/animations/watchit-spinner.json';

interface WatchitLoaderProps {
  speed?: number;
  style?: any;
}

export const WatchitLoader: FC<WatchitLoaderProps> = ({ speed = 1.5, style }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <Box sx={[styles.loader, style]}>
      <Lottie
        lottieRef={lottieRef}
        animationData={watchitLogo}
        loop
        autoplay
        style={styles.lottie}
      />
    </Box>
  );
};

const styles = {
  loader: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  lottie: {
    width: 100,
    height: 100,
  },
};