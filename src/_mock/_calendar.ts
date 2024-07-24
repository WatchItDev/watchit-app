import { palette as themePalette } from 'src/theme/palette';

// ----------------------------------------------------------------------

const palette = themePalette('light');

export const CALENDAR_COLOR_OPTIONS = [
  palette.primary.main,
  palette.secondary.main,
  palette.info.main,
  palette.info.darker,
  palette.success.main,
  palette.warning.main,
  palette.error.main,
  palette.error.darker,
];
