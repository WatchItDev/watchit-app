// i18n
import '@src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// routes
import Router from '@src/routes/sections';
// theme
import ThemeProvider from '@src/theme';
// hooks
import { useScrollToTop } from '@src/hooks/use-scroll-to-top';
// components
import ProgressBar from '@src/components/progress-bar';
import MotionLazy from '@src/components/animate/motion-lazy';
import SnackbarProvider from '@src/components/snackbar/snackbar-provider';
import { SettingsProvider, SettingsDrawer } from '@src/components/settings';
import { AuthProvider } from '@src/auth/context/lens';
import {ResponsiveOverlay} from "@src/components/responsive-overlay";

import { Buffer } from 'buffer';

window.Buffer = Buffer;

// ----------------------------------------------------------------------

export default function App() {
  const charAt = `

  ██        ██
  ▓▓   ▓▓
  ▒▒  ▒▒▒▒  ▒▒
  ▒▒▒▒    ▒▒▒▒
  ░░░      ░░░

`;

  console.info(`%c${charAt}`, 'color: #4A34B8');

  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'dark', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <AuthProvider>
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <SettingsDrawer />
                <ProgressBar />
                <Router />
                <ResponsiveOverlay />
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </AuthProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
