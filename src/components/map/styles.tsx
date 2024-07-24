import { Popup } from 'react-map-gl';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
// theme
import { bgBlur } from 'src/theme/css';

// ----------------------------------------------------------------------

export function StyledMapControls() {
  const theme = useTheme();

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        '.mapboxgl-ctrl.mapboxgl-ctrl-group': {
          borderRadius: '8px',
          boxShadow: theme.customShadows.z8,
        },
        '.mapboxgl-ctrl-zoom-in': {
          borderRadius: '8px 8px 0 0',
        },
        '.mapboxgl-ctrl-compass': {
          borderRadius: '0 0 8px 8px',
        },
        '.mapboxgl-ctrl-fullscreen': {
          '.mapboxgl-ctrl-icon': {
            transform: ' scale(0.75)',
          },
        },
        '.mapboxgl-ctrl-group button+button': {
          borderTop: `1px solid ${theme.palette.divider}`,
        },
        '.mapboxgl-ctrl.mapboxgl-ctrl-scale': {
          border: 'none',
          lineHeight: '14px',
          borderRadius: '4px',
          color: theme.palette.common.white,
          fontWeight: theme.typography.fontWeightBold,
          backgroundImage: `linear-gradient(to right, #8a2387, #e94057, #f27121)`,
        },
      }}
    />
  );

  return inputGlobalStyles;
}

// ----------------------------------------------------------------------

export const StyledPopup = styled(Popup)(({ theme }) => {
  const isRTL = theme.direction === 'rtl';

  return {
    '& .mapboxgl-popup-content': {
      maxWidth: 180,
      padding: theme.spacing(1),
      boxShadow: theme.customShadows.z20,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[800],
    },
    '& .mapboxgl-popup-close-button': {
      width: 24,
      height: 24,
      fontSize: 16,
      opacity: 0.48,
      color: theme.palette.common.white,
      right: isRTL && '0',
      left: isRTL && 'auto',
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        outline: 'none',
      },
    },
    '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
      marginBottom: -1,
      borderBottomColor: theme.palette.grey[800],
    },
    '&.mapboxgl-popup-anchor-right .mapboxgl-popup-tip': {
      marginLeft: -1,
      borderLeftColor: theme.palette.grey[800],
    },
    '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
      marginTop: -1,
      borderTopColor: theme.palette.grey[800],
    },
    '&.mapboxgl-popup-anchor-left .mapboxgl-popup-tip': {
      marginRight: -1,
      borderRightColor: theme.palette.grey[800],
    },
  };
});

// ----------------------------------------------------------------------

export const StyledControlPanel = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.grey[900] }),
  zIndex: 9,
  minWidth: 200,
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));
