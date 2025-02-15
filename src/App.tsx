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
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { useNotifications } from "@src/hooks/use-notifications.ts";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { setGlobalNotifier } from "@notifications/internal-notifications.ts";
import { publicClientWebSocket } from "@src/clients/viem/publicClient.ts";
import { GLOBAL_CONSTANTS } from "@src/config-global.ts";
import LedgerVaultAbi from "@src/config/abi/LedgerVault.json";
import { setBlockchainEvents } from "@redux/blockchain-events";
import { subscribeToNotifications } from "@src/utils/subscribe-notifications-supabase.ts";

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
    // <MetaMaskProvider
    //   sdkOptions={{
    //     dappMetadata: {
    //       name: 'Watchit Dapp',
    //       url: window.location.href,
    //     },
    //     openDeeplink: (url) => {
    //       const isMM = (window as any).ethereum?.isMetaMask;
    //       if (typeof (window as any).ethereum === 'undefined' || !isMM) {
    //         // Mobile version / no extension
    //         window.location.href = 'https://metamask.app.link';
    //       } else {
    //         // Desktop with MetaMask extension
    //         window.location.href = url;
    //       }
    //     },
    //     // headless: true,  // If we wanted to personalize our own modals
    //   }}
    // >
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
        <Provider store={store}>
          <AuthProvider>
            <ThemeProvider>
              {/* <MotionLazy> */}
              <SnackbarProvider>
                <AppContent />
              </SnackbarProvider>
              {/* </MotionLazy> */}
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </SettingsProvider>
    </LocalizationProvider>
    // </MetaMaskProvider>
  );
}


interface EventArgs {
  recipient?: string;
  origin?: string;
}
const AppContent = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { getNotifications } = useNotifications();
  const sessionData = useSelector((state: any) => state.auth.session);

  useEffect(() => {
    // Set the global reference so we can call notify(...) anywhere.
    setGlobalNotifier(enqueueSnackbar);
  }, []);

  const EVENT_POLLING_INTERVAL = 2_000
  const GENESIS_LEDGER_BLOCK = 16651439n
  const watchEvent = (eventName: string, args: EventArgs) => {
    return publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      fromBlock: GENESIS_LEDGER_BLOCK,
      pollingInterval: EVENT_POLLING_INTERVAL,
      abi: LedgerVaultAbi.abi,
      batch: false,
      eventName,
      args,
      onLogs: (logs) => {
        dispatch(setBlockchainEvents(logs));
      },
    });
  };

  useEffect(() => {
    if (!sessionData?.address) {
      // if the user is not logged in we cannot retrieve events..
      return;
    }

    const events = [
      { name: 'FundsDeposited', args: { recipient: sessionData?.address } },
      { name: 'FundsWithdrawn', args: { origin: sessionData?.address } },
      { name: 'FundsTransferred', args: { origin: sessionData?.address } },
      { name: 'FundsTransferred', args: { recipient: sessionData?.address } },
      { name: 'FundsClaimed', args: { claimer: sessionData?.address } },
    ];

    // each event start a long-polling to collect we need to clean intervals during unmount
    const cleanup = events.map(event => watchEvent(event.name, event.args));
    return () => cleanup.forEach(unwatch => unwatch());
  }, [sessionData?.address]);


  useEffect(() => {
    if (sessionData?.profile?.id) {
      // Subscribe to notifications channel
      subscribeToNotifications(sessionData?.profile?.id, dispatch, ['notifications']);
      // Set the notifications in first render
      getNotifications(sessionData?.profile?.id).then(() => { });
    }
  }, [sessionData?.profile?.id, dispatch]);

  return (
    <>
      <SettingsDrawer />
      <ProgressBar />
      <Router />
      <ResponsiveOverlay />
    </>
  )
}
