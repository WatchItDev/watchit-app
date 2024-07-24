import { palette } from '../palette';
import { customShadows } from '../custom-shadows';

// ----------------------------------------------------------------------

export function contrast(contrastBold: boolean, mode: 'light' | 'dark') {
  const theme = {
    ...(contrastBold &&
      mode === 'light' && {
        palette: {
          background: {
            default: palette(mode).grey[100],
          },
        },
      }),
  };

  const components = {
    ...(contrastBold && {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: customShadows(mode).z4,
          },
        },
      },
    }),
  };

  return {
    theme,
    components,
  };
}
