import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function PlanPremiumIcon({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <g transform="translate(0 -9)">
        <g transform="translate(0 18.271)">
          <g transform="translate(9.167 19.932)">
            <path fill={PRIMARY_DARK} d="M53.333 17.441H61.666V24.915999999999997H53.333z" />
            <path
              fill={PRIMARY_DARKER}
              d="M.935 20.42L25.963 8.001a5.059 5.059 0 014.52.012L60.74 23.228a1.68 1.68 0 01.015 2.996L35.417 39.301a5.059 5.059 0 01-4.694-.029L.893 23.41a1.68 1.68 0 01.042-2.99z"
            />
            <path
              fill={PRIMARY_DARK}
              d="M32.5 34.151v4.18a1.132 1.132 0 01-1.566 1.045l-.1-.047v-7.525A2.49 2.49 0 0132.5 34.15zM.833 15.908l30 15.896v7.525l-30-15.899v-.019l-.115-.066A1.565 1.565 0 010 22.029v-7.91l.833 1.789z"
            />
            <path
              fill={PRIMARY_MAIN}
              fillRule="nonzero"
              d="M.935 12.945L25.963.527a5.059 5.059 0 014.52.012L60.74 15.753a1.68 1.68 0 01.015 2.997L35.417 31.827a5.059 5.059 0 01-4.694-.03L.893 15.937a1.68 1.68 0 01.042-2.991z"
            />
          </g>
        </g>

        <g transform="translate(0 9.136)">
          <g transform="translate(9.167 19.932)">
            <path fill={PRIMARY_DARK} d="M53.333 17.441H61.666V24.915999999999997H53.333z" />
            <path
              fill={PRIMARY_DARKER}
              d="M.935 20.42L25.963 8.001a5.059 5.059 0 014.52.012L60.74 23.228a1.68 1.68 0 01.015 2.996L35.417 39.301a5.059 5.059 0 01-4.694-.029L.893 23.41a1.68 1.68 0 01.042-2.99z"
            />
            <path
              fill={PRIMARY_DARK}
              d="M32.5 34.151v4.18a1.132 1.132 0 01-1.566 1.045l-.1-.047v-7.525A2.49 2.49 0 0132.5 34.15zM.833 15.908l30 15.896v7.525l-30-15.899v-.019l-.115-.066A1.565 1.565 0 010 22.029v-7.91l.833 1.789z"
            />
            <path
              fill={PRIMARY_MAIN}
              fillRule="nonzero"
              d="M.935 12.945L25.963.527a5.059 5.059 0 014.52.012L60.74 15.753a1.68 1.68 0 01.015 2.997L35.417 31.827a5.059 5.059 0 01-4.694-.03L.893 15.937a1.68 1.68 0 01.042-2.991z"
            />
          </g>
        </g>

        <g transform="translate(9.167 19.932)">
          <path fill={PRIMARY_DARK} d="M53.333 17.441H61.666V24.915999999999997H53.333z" />
          <path
            fill={PRIMARY_DARKER}
            d="M.935 20.42L25.963 8.001a5.059 5.059 0 014.52.012L60.74 23.228a1.68 1.68 0 01.015 2.996L35.417 39.301a5.059 5.059 0 01-4.694-.029L.893 23.41a1.68 1.68 0 01.042-2.99z"
          />
          <path
            fill={PRIMARY_DARK}
            d="M32.5 34.151v4.18a1.132 1.132 0 01-1.566 1.045l-.1-.047v-7.525A2.49 2.49 0 0132.5 34.15zM.833 15.908l30 15.896v7.525l-30-15.899v-.019l-.115-.066A1.565 1.565 0 010 22.029v-7.91l.833 1.789z"
          />
          <path
            fill={PRIMARY_MAIN}
            fillRule="nonzero"
            d="M.935 12.945L25.963.527a5.059 5.059 0 014.52.012L60.74 15.753a1.68 1.68 0 01.015 2.997L35.417 31.827a5.059 5.059 0 01-4.694-.03L.893 15.937a1.68 1.68 0 01.042-2.991z"
          />
        </g>
      </g>
    </Box>
  );
}

export default memo(PlanPremiumIcon);
