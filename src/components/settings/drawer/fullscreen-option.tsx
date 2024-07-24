import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
//
import SvgColor from '../../svg-color';

// ----------------------------------------------------------------------

export default function FullScreenOption() {
  const [fullscreen, setFullscreen] = useState(false);

  const onToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  return (
    <Box sx={{ p: 2.5 }}>
      <ButtonBase
        onClick={onToggleFullScreen}
        sx={{
          width: 1,
          height: 48,
          borderRadius: 1,
          color: 'text.disabled',
          typography: 'subtitle2',
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          ...(fullscreen && {
            color: 'text.primary',
          }),
          '& .svg-color': {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.grey[500]} 0%, ${theme.palette.grey[600]} 100%)`,
            ...(fullscreen && {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            }),
          },
        }}
      >
        <SvgColor
          src={`/assets/icons/setting/${fullscreen ? 'ic_exit_full_screen' : 'ic_full_screen'}.svg`}
          sx={{ width: 16, height: 16, mr: 1 }}
        />

        {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </ButtonBase>
    </Box>
  );
}
