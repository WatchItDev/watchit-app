import {forwardRef} from "react";
// @mui
import {useTheme} from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box, {BoxProps} from "@mui/material/Box";
// routes
import {RouterLink} from "@src/routes/components";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({disabledLink = false, sx, ...other}, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: "inline-flex",
        ...sx,
      }}
      {...other}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M439.698 269.001C388.573 309.777 364.265 270.7 342.947 219.302C360.588 178.567 372.258 153.709 377.96 144.727C388.711 127.783 400.44 114.953 414.864 107.551C440.686 92.1607 471.854 89.2624 498.515 102.537C506.86 106.692 509.251 116.987 505.372 125.464L439.698 269.001Z"
          fill="url(#paint0_linear_1612_200696)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M81.9823 290.08C128.222 392.677 176.019 489.34 230.924 347.545C238.435 329.317 243.91 293.891 256.174 293.891V294.071C268.438 294.071 273.911 329.497 281.422 347.725C336.33 489.52 384.127 392.857 430.366 290.26C433.846 282.522 437.188 275.138 440.049 268.72C334.083 353.792 343.005 96.7866 256.174 94.7444V94.5645C169.342 96.6066 178.265 353.612 72.2993 268.543C75.1581 274.958 78.5008 282.342 81.9823 290.08Z"
          fill="url(#paint1_linear_1612_200696)"
        />
        <path
          d="M72.2994 268.544C123.76 310.017 147.965 270.794 169.283 219.397C151.642 178.662 139.743 153.245 134.042 144.263C123.29 127.319 111.562 114.49 97.1366 107.087C71.3143 91.6968 40.146 88.7985 13.4851 102.074C5.14018 106.229 2.74906 116.523 6.62736 125L72.2994 268.544Z"
          fill="url(#paint2_linear_1612_200696)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1612_200696"
            x1="374.28"
            y1="367.964"
            x2="482.143"
            y2="277.564"
            gradientUnits="userSpaceOnUse">
            <stop stopColor={PRIMARY_DARK} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1612_200696"
            x1="440.049"
            y1="419"
            x2="440.049"
            y2="94.5645"
            gradientUnits="userSpaceOnUse">
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1612_200696"
            x1="137.908"
            y1="368.109"
            x2="29.8215"
            y2="277.6"
            gradientUnits="userSpaceOnUse">
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{display: "contents"}}>
      {logo}
    </Link>
  );
});

export default Logo;
