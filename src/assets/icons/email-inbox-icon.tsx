import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function EmailInboxIcon({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const WARNING_LIGHT = theme.palette.warning.light;

  const WARNING_DARK = theme.palette.warning.dark;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 96 97"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <g filter="url(#filter0_di_1870_133886)">
        <path
          fill={WARNING_LIGHT}
          fillRule="evenodd"
          d="M16 20.01v19.82c0 2.618 1.272 5.067 3.463 6.502C26.233 50.768 41.16 60.01 48 60.01s21.767-9.242 28.537-13.678C78.727 44.897 80 42.448 80 39.83V20.01c0-6.628-5.373-12-12-12H28c-6.627 0-12 5.372-12 12zm15 0a3 3 0 000 6h18a3 3 0 000-6H31zm0 14a3 3 0 000 6h30a3 3 0 000-6H31z"
          clipRule="evenodd"
        />
      </g>
      <g style={{ mixBlendMode: 'overlay' }} filter="url(#filter1_i_1870_133886)">
        <path
          fill="#fff"
          fillOpacity="0.04"
          fillRule="evenodd"
          d="M16 20.01v19.82c0 2.618 1.272 5.067 3.463 6.502C26.233 50.768 41.16 60.01 48 60.01s21.767-9.242 28.537-13.678C78.727 44.897 80 42.448 80 39.83V20.01c0-6.628-5.373-12-12-12H28c-6.627 0-12 5.372-12 12zm15 0a3 3 0 000 6h18a3 3 0 000-6H31zm0 14a3 3 0 000 6h30a3 3 0 000-6H31z"
          clipRule="evenodd"
        />
      </g>
      <path
        fill={WARNING_DARK}
        d="M28 23.01a3 3 0 013-3h18a3 3 0 010 6H31a3 3 0 01-3-3zM28 37.01a3 3 0 013-3h30a3 3 0 010 6H31a3 3 0 01-3-3z"
      />
      <path
        fill={PRIMARY_MAIN}
        d="M16 25.014a266.095 266.095 0 00-5.284 4.026c-2.408 1.883-3.918 4.66-4.121 7.71C6.317 40.9 6 47.868 6 58.01c0 9.591.568 16.343 1.098 20.558.438 3.476 2.765 6.232 6.196 6.94 5.5 1.136 16.005 2.502 34.706 2.502 18.701 0 29.206-1.366 34.706-2.502 3.431-.708 5.758-3.464 6.196-6.94C89.432 74.353 90 67.601 90 58.01c0-10.142-.317-17.11-.595-21.26-.203-3.05-1.713-5.827-4.12-7.71A266.095 266.095 0 0080 25.014V39.83c0 2.619-1.272 5.067-3.463 6.502C69.767 50.768 54.84 60.01 48 60.01s-21.767-9.242-28.537-13.678C17.273 44.897 16 42.45 16 39.83V25.014z"
      />
      <g style={{ mixBlendMode: 'overlay' }} filter="url(#filter2_i_1870_133886)">
        <path
          fill="#fff"
          fillOpacity="0.04"
          d="M16 25.014a266.095 266.095 0 00-5.284 4.026c-2.408 1.883-3.918 4.66-4.121 7.71C6.317 40.9 6 47.868 6 58.01c0 9.591.568 16.343 1.098 20.558.438 3.476 2.765 6.232 6.196 6.94 5.5 1.136 16.005 2.502 34.706 2.502 18.701 0 29.206-1.366 34.706-2.502 3.431-.708 5.758-3.464 6.196-6.94C89.432 74.353 90 67.601 90 58.01c0-10.142-.317-17.11-.595-21.26-.203-3.05-1.713-5.827-4.12-7.71A266.095 266.095 0 0080 25.014V39.83c0 2.619-1.272 5.067-3.463 6.502C69.767 50.768 54.84 60.01 48 60.01s-21.767-9.242-28.537-13.678C17.273 44.897 16 42.45 16 39.83V25.014z"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_1870_133886"
          width="80"
          height="68"
          x="12"
          y="4.01"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx="4" dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix values="0 0 0 0 0.717647 0 0 0 0 0.431373 0 0 0 0 0 0 0 0 0.16 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1870_133886" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_1870_133886" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx="-1" dy="-1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0.717647 0 0 0 0 0.431373 0 0 0 0 0 0 0 0 0.48 0" />
          <feBlend in2="shape" result="effect2_innerShadow_1870_133886" />
        </filter>
        <filter
          id="filter1_i_1870_133886"
          width="66"
          height="54"
          x="14"
          y="6.01"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
          <feBlend in2="shape" result="effect1_innerShadow_1870_133886" />
        </filter>
        <filter
          id="filter2_i_1870_133886"
          width="86"
          height="64.996"
          x="4"
          y="23.014"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
          <feBlend in2="shape" result="effect1_innerShadow_1870_133886" />
        </filter>
      </defs>
    </Box>
  );
}

export default memo(EmailInboxIcon);
