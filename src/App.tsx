import { store } from '@redux/store';
// i18n
import '@src/locales/i18n';

// scrollbar
// @ts-ignore
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// editor
// @ts-ignore
import 'react-quill/dist/quill.snow.css';

// carousel
// @ts-ignore
import 'slick-carousel/slick/slick.css';
// @ts-ignore
import 'slick-carousel/slick/slick-theme.css';

// image
// @ts-ignore
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
import { AuthProvider } from '@src/auth/context/web3Auth';
import { ResponsiveOverlay } from '@src/components/responsive-overlay';

import { Buffer } from 'buffer';
import { Provider } from 'react-redux';

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
          <Provider store={store}>
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
          </Provider>
        </AuthProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
