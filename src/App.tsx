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
import {Provider, useDispatch, useSelector} from 'react-redux';
import { MetaMaskProvider } from '@metamask/sdk-react';
import {useNotifications} from "@src/hooks/use-notifications.ts";
import {useSnackbar} from "notistack";
import {useEffect} from "react";
import {setGlobalNotifier} from "@notifications/internal-notifications.ts";
import {publicClientWebSocket} from "@src/clients/viem/publicClient.ts";
import {GLOBAL_CONSTANTS} from "@src/config-global.ts";
import LedgerVaultAbi from "@src/config/abi/LedgerVault.json";
import {setBlockchainEvents} from "@redux/blockchain-events";
import {subscribeToNotifications} from "@src/utils/subscribe-notifications-supabase.ts";
import {getIPInfo, getUserIP} from "@src/utils/get-user-ip.ts";
import {storeIpInfoInSupabase} from "@src/utils/supabase-actions.ts";

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
          const isMM = (window as any).ethereum?.isMetaMask;
          if (typeof (window as any).ethereum === 'undefined' || !isMM) {
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
            <AuthProvider>
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <AppContent />
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
            </AuthProvider>
          </Provider>
        </SettingsProvider>
      </LocalizationProvider>
    </MetaMaskProvider>
  );
}


const AppContent = () => {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { getNotifications } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  console.log(sessionData)

  useEffect(() => {
    // Set the global reference so we can call notify(...) anywhere.
    setGlobalNotifier(enqueueSnackbar);
  }, [enqueueSnackbar]);


  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();

      // Get IP info
      const ipInfo = await getIPInfo(ip);

      await storeIpInfoInSupabase(ip,ipInfo, sessionData?.address);
    };
    fetchIP();
  }, []);

  useEffect(() => {
    if (!sessionData?.address) return;

    // FundsDeposited (when i am the recipient)
    const unwatchDeposit = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsDeposited',
      args: { recipient: sessionData?.address },
      onLogs: (logs) => {
        console.log('New deposit (user as recipient):', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });

    // FundsWithdrawn (when i am the origin)
    const unwatchWithdraw = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsWithdrawn',
      args: { origin: sessionData?.address },
      onLogs: (logs) => {
        console.log('New withdraw (user as origin):', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });

    // FundsTransferred (when I send)
    const unwatchTransferFrom = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsTransferred',
      args: { origin: sessionData?.address },
      onLogs: (logs) => {
        console.log('New transfer from me:', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });

    // FundsTransferred (when I receive)
    const unwatchTransferTo = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsTransferred',
      args: { recipient: sessionData?.address },
      onLogs: (logs) => {
        console.log('New transfer to me:', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });

    return () => {
      unwatchDeposit();
      unwatchWithdraw();
      unwatchTransferFrom();
      unwatchTransferTo();
    };
  }, [sessionData?.address]);

  useEffect(() => {
    if (sessionData?.profile?.id) {
      // Subscribe to notifications channel
      subscribeToNotifications(sessionData?.profile?.id, dispatch, ['notifications']);

      // Set the notifications in first render
      getNotifications(sessionData?.profile?.id).then(() => {});
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
