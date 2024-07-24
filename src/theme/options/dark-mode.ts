import { palette } from '../palette';
import { shadows } from '../shadows';
import { customShadows } from '../custom-shadows';

// ----------------------------------------------------------------------

export function darkMode(mode: 'light' | 'dark') {
  const theme = {
    palette: palette(mode),
    shadows: shadows(mode),
    customShadows: customShadows(mode),
  };

  return theme;
}
