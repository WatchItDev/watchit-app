import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
//
import BackgroundShape from './background-shape';

// ----------------------------------------------------------------------

function OrderCompleteIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <BackgroundShape />

      <image href="/assets/illustrations/characters/character_10.png" height="300" x="300" y="30" />

      <path
        fill="#DFE3E8"
        d="M253.579 162.701a5.06 5.06 0 01-4.861-3.646l-15.033-53.327a16.19 16.19 0 00-15.276-12.007h-78.471a16.174 16.174 0 00-15.325 11.995l-14.985 53.29a5.06 5.06 0 01-6.164 3.266 5.055 5.055 0 01-3.558-6l14.985-53.291a26.31 26.31 0 0125.047-19.347h78.471a26.327 26.327 0 0124.998 19.36l14.985 53.29a5.054 5.054 0 01-3.5 6.222 4.786 4.786 0 01-1.313.195z"
      />

      <path
        fill="url(#paint0_linear_1_68)"
        d="M244.501 272.368H113.846a10.329 10.329 0 01-10.245-9.017l-12.153-95.716H266.85l-12.153 95.716a10.3 10.3 0 01-10.196 9.017z"
      />

      <path
        fill="url(#paint1_linear_1_68)"
        d="M268.151 155.117H90.196c-5.631 0-10.196 4.565-10.196 10.196v.887c0 5.632 4.565 10.197 10.196 10.197h177.955c5.631 0 10.196-4.565 10.196-10.197v-.887c0-5.631-4.565-10.196-10.196-10.196z"
      />

      <path
        fill={PRIMARY_DARKER}
        d="M128.66 184.017h-.012a7.874 7.874 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875zM162.335 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM196.023 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM229.699 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875z"
      />

      <path
        fill="url(#paint2_linear_1_68)"
        d="M202.793 80h-47.239a8.762 8.762 0 00-8.762 8.762v.012a8.762 8.762 0 008.762 8.763h47.239a8.762 8.762 0 008.762-8.763v-.012A8.762 8.762 0 00202.793 80z"
      />

      <path
        fill="#fff"
        d="M254.289 279.577c23.907 0 43.288-19.381 43.288-43.288 0-23.908-19.381-43.289-43.288-43.289C230.381 193 211 212.381 211 236.289c0 23.907 19.381 43.288 43.289 43.288z"
      />

      <path
        fill="url(#paint3_linear_1_68)"
        d="M243.999 256.002l-15.183-16.746a3.15 3.15 0 01.214-4.444l4.219-3.833a3.146 3.146 0 014.444.214l9.144 10.065 25.184-23.417a3.149 3.149 0 014.444.16l3.876 4.176a3.146 3.146 0 01.843 2.255 3.148 3.148 0 01-1.004 2.189l-31.758 29.531a3.119 3.119 0 01-4.423-.15z"
      />

      <defs>
        <linearGradient
          id="paint0_linear_1_68"
          x1="267"
          x2="80.541"
          y1="272"
          y2="247.455"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_MAIN} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>

        <linearGradient
          id="paint1_linear_1_68"
          x1="80"
          x2="80"
          y1="155.117"
          y2="176.397"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>

        <linearGradient
          id="paint2_linear_1_68"
          x1="146.792"
          x2="146.792"
          y1="80"
          y2="97.537"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>

        <linearGradient
          id="paint3_linear_1_68"
          x1="228"
          x2="228"
          y1="217"
          y2="257"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
    </Box>
  );
}

export default memo(OrderCompleteIllustration);
