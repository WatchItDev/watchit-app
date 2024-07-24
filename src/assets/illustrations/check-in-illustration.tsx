import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function CheckInIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_LIGHTER = theme.palette.primary.lighter;

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path
        fill="url(#a)"
        d="M134.926 133.612c-1.2-3.2-5.8-4.1-8.1-1.6-1.3-7.8 5-32.3-8.9-32-72.8-.5-48.2-8-52.4 77.7-.1 4.8 4.1 9 8.9 8.9h43.5c14 .4 7.6-24.5 8.9-32.4 2.9 3.2 8.7.8 8.5-3.5-.1-1 .4-16.5-.4-17.1zm-2.5 18.3h-5.6v-17.4h5.6v17.4z"
      />

      <path
        fill="url(#b)"
        d="M74.426 190.212c.1 5.9-9.2 5.9-9.1 0-.1-5.9 9.2-5.9 9.1 0zm46.4-4.5c-5.9-.1-5.9 9.2 0 9.1 5.9.1 5.9-9.2 0-9.1z"
      />

      <path
        fill={PRIMARY_DARK}
        d="M73.126 99.513h2.5v87.499h-2.5v-87.5zm7.1 87.399h2.5v-87.4h-2.5v87.4zm7 0h2.5v-87.4h-2.5v87.4zm7.1 0h2.5v-87.4h-2.5v87.4zm7 0h2.5v-87.4h-2.5v87.4zm7.1 0h2.5v-87.4h-2.5v87.4zm7-87.4v87.5h2.5v-87.5h-2.5z"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M140.026 60.912l-1.8 6.7c-3.3-.9-7.3-.7-10.6.3.2-3.2 0-6.3-.6-9.4l-17.3-7.5c-2 14.2 1.4 21.6 7.4 32.8l-10.3 4.8c-1.7 4.1-4.1 4-7.1-.2-6.3 8.4-15.3-6.8-24.7-.3l-1.5-6.6-6.2.2c-5-10.2-13-36.6-1.2-43.9 0 0 0 .1.1.1 3-2 6.6-3.4 10.1-4.4l8.5 10.6c5.6-11.1 7.4-14.8 21.6-12.8l28.6 16.6c4.4 2.3 6.7 8 5 13z"
      />

      <path
        fill={PRIMARY_LIGHTER}
        fillRule="evenodd"
        d="M107.626 52.712h.1v2.3h-.1v12.4c0 1-.9 1.9-1.9 1.9-1.7-.5-9.1 1.4-8.9-1.9v-18.1c0-1 .9-1.9 1.9-1.9.3 0 7.7-.1 7.7.1 1.9.6 1.1 3.8 1.2 5.2zm-4 .1c0 2.2-3.3 2.2-3.3 0 0-2.1 3.3-2.1 3.3 0z"
        clipRule="evenodd"
      />

      <path
        fill={PRIMARY_DARKER}
        d="M130.826 91.813l-12.9 56.5c1.3 1.2 6.9 11.4 6.9 13.2-1.8 5.8-12.9 0-15.9-3.3-1.6-6.9 6-48.8 5.5-56.6-3.9-.3-10.4.4-14.1.8-6.6.2-15.7-1.3-22.4-.8l-.2 1.3 5.4 45.2h-.2c.3.2.7.5 1.1.8 0 1.9 1.5 7.7.3 9.4-3.4 3.7-9.2 5.9-13.5 5.7-1.7-.1-2.9-2-2.2-3.6.1-.1 6.1-12 6.3-11.5h-.4l-13-57.1c-1-4.3 1.5-9 5.7-10.4 0 .1.1.2.1.3l6.2-.2 1.5 6.6c.4-.2.7-.3 1.1-.5.9-.3 1.8-.6 2.7-.8 7.4-2.8 14.8 9.4 20.9 1.5 3 4.2 5.4 4.3 7.1.2l7.6-3.5c.6-1 1.5-1.9 2.4-2.5.2.5.5 1 .8 1.3 4.6-.3 8.2-1.4 12.5 2.3.9 1.7 1.1 3.8.7 5.7zm-58.1-68.2c0-.8.1-1.5.2-2.2-1-.9-.2-5.2 1.3-3.3.5-.9 1.1-1.6 1.9-2.3 2.8 6.1 11.8 2.8 16.5 2.1 1.5 2.3 2 5.4 1.4 8.1 9.6-28.2-30.8-27.7-21.1-.4-.1-.6-.2-1.3-.2-2z"
      />

      <path
        fill="#FBCDBE"
        d="M84.826 43.913l-8.5-10.6c-.1 0-.2.1-.3.1l-.2-2.3c-2.4-2.4-3.6-6.3-2.8-9.7-1-.9-.2-5.2 1.3-3.3.5-.9 1.1-1.6 1.9-2.3 2.8 6.1 11.8 2.8 16.5 2.1 2.9 4.3 1.8 10.9-2.2 14l.2 1.7c-.2-.1-5.9 10.3-5.9 10.3zm42.8 23.9v-.7c-.2 3.4-1 6.8-2.2 10.1-1.4.3-7.5-.3-8.4 1.1-1.5 1.4-.2 5.3 1.5 5.9 4.5-1.6 7.7-1.2 11.7 1.9l7.2-18.6c-3.2-.8-6.8-.6-9.8.3zm-20.2-9.8c-3.8-2.8-20.3 9.5-25.7 10.2-2.6 3.7-1.8 7.4 1 11.2 5.4-2.3 11.6-6.5 17.8-11.4l5.8-1.5c3.9-.9 4.7-6.7 1.1-8.5z"
      />

      <defs>
        <linearGradient
          id="a"
          x1="64.751"
          x2="64.751"
          y1="99.643"
          y2="186.617"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>

        <linearGradient
          id="b"
          x1="95.286"
          x2="95.286"
          y1="280.421"
          y2="185.693"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
    </Box>
  );
}

export default memo(CheckInIllustration);
