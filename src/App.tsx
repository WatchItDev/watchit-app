// REACT IMPORTS
import { useEffect } from "react";

// REDUX IMPORTS
import { Provider, useDispatch } from 'react-redux';

// STYLES IMPORTS
import 'simplebar-react/dist/simplebar.min.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

// MUI IMPORTS
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// THIRD PARTY IMPORTS
import { Buffer } from 'buffer';

// LOCAL NOTIFICATIONS
import { useSnackbar } from "notistack";

// LOCAL IMPORTS
import '@src/locales/i18n';
import Router from '@src/routes/sections';
import ThemeProvider from '@src/theme';
import ProgressBar from '@src/components/progress-bar';
import MotionLazy from '@src/components/animate/motion-lazy';
import SnackbarProvider from '@src/components/snackbar/snackbar-provider';
import LedgerVaultAbi from "@src/config/abi/LedgerVault.json";
import { store } from '@redux/store'
import { useScrollToTop } from '@src/hooks/use-scroll-to-top';
import { SettingsProvider, SettingsDrawer } from '@src/components/settings';
import { ApiProvider } from '@src/contexts/api';
import { ResponsiveOverlay } from '@src/components/responsive-overlay';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { useNotifications } from "@src/hooks/use-notifications.ts";
import { setGlobalNotifier } from "@src/libs/notifications/internal-notifications.ts";
import { useAuth } from '@src/hooks/use-auth.ts';
import { publicClientWebSocket } from "@src/clients/viem/publicClient.ts";
import { setBlockchainEvents } from "@redux/blockchain-events";
import { subscribeToNotifications } from "@src/libs/subscribe-notifications-supabase.ts";
import { GLOBAL_CONSTANTS } from "@src/config-global.ts";
import { Web3AuthProvider } from '@web3auth/modal/react';
import { web3AuthOptions } from '@src/config/web3auth';

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
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: 'Watchit Dapp',
          url: window.location.href,
        },
        openDeeplink: (url) => {
          const isMM = window.ethereum?.isMetaMask;
          if (typeof window.ethereum === 'undefined' || !isMM) {
            // Mobile version / no extension
            window.location.href = 'https://metamask.app.link';
          } else {
            // Desktop with MetaMask extension
            window.location.href = url;
          }
        },
        // headless: true,  // If we wanted to personalize our own modals
      }}
    >
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
            <Web3AuthProvider config={{ web3AuthOptions }}>
              <ApiProvider>
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <AppContent />
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </ApiProvider>
            </Web3AuthProvider>
           </Provider>
         </SettingsProvider>
       </LocalizationProvider>
     </MetaMaskProvider>
  );
}


interface EventArgs {
  recipient?: string;
  origin?: string;
}
const AppContent = () => {
  const dispatch = useDispatch();
  const { session: sessionData } = useAuth();
  const { getNotifications } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Set the global reference so we can call notify(...) anywhere.
    setGlobalNotifier(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const watchEvent = (eventName: string, args: EventArgs, logText: string) => {
    return publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName,
      args,
      onLogs: (logs) => {
        console.log(logText, logs);
        dispatch(setBlockchainEvents(logs));
      },
    });
  };

  useEffect(() => {
    if (!sessionData?.address) return;

    const events = [
      { name: 'FundsDeposited', args: { recipient: sessionData?.address }, logText: 'New deposit (user as recipient):' },
      { name: 'FundsWithdrawn', args: { origin: sessionData?.address }, logText: 'New withdraw (user as origin):' },
      { name: 'FundsTransferred', args: { origin: sessionData?.address }, logText: 'New transfer from me:' },
      { name: 'FundsTransferred', args: { recipient: sessionData?.address }, logText: 'New transfer to me:' },
      { name: 'FundsClaimed', args: { claimer: sessionData?.address }, logText: 'New funds claimed:' },
      { name: 'FundsCollected', args: { from: sessionData?.address }, logText: 'New funds collected:' },
    ];

    const cleanup = events.map(event => watchEvent(event.name, event.args, event.logText));
    return () => cleanup.forEach(unwatch => unwatch());
  }, [sessionData?.address]);


  useEffect(() => {
    if (sessionData?.address) {
      subscribeToNotifications(sessionData?.address, dispatch, ['notifications']);
      getNotifications(sessionData?.address);
    }
  }, [sessionData?.address]);

  return (
    <>
      <SettingsDrawer />
      <ProgressBar />
      <Router />
      <ResponsiveOverlay />
    </>
  )
}
