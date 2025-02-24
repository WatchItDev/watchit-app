import { useEffect } from "react"
import { MetaMaskProvider } from '@metamask/sdk-react'
import { setGlobalNotifier } from "@notifications/internal-notifications.ts"
import { setBlockchainEvents } from "@redux/blockchain-events"
import { store } from '@redux/store'
import '@src/locales/i18n'
// @ts-ignore
import 'simplebar-react/dist/simplebar.min.css'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
// @ts-ignore
import 'react-quill/dist/quill.snow.css'
// @ts-ignore
import 'slick-carousel/slick/slick.css'
// @ts-ignore
import 'slick-carousel/slick/slick-theme.css'
// @ts-ignore
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Buffer } from 'buffer'
import { useSnackbar } from "notistack"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AuthProvider } from '@src/auth/context/web3Auth'
import { publicClientWebSocket } from "@src/clients/viem/publicClient.ts"
import MotionLazy from '@src/components/animate/motion-lazy'
import ProgressBar from '@src/components/progress-bar'
import { ResponsiveOverlay } from '@src/components/responsive-overlay'
import { SettingsProvider, SettingsDrawer } from '@src/components/settings'
import SnackbarProvider from '@src/components/snackbar/snackbar-provider'
import LedgerVaultAbi from "@src/config/abi/LedgerVault.json"
import { GLOBAL_CONSTANTS } from "@src/config-global.ts"
import { useNotifications } from "@src/hooks/use-notifications.ts"
import { useScrollToTop } from '@src/hooks/use-scroll-to-top'
import Router from '@src/routes/sections'
import ThemeProvider from '@src/theme'
import { subscribeToNotifications } from "@src/utils/subscribe-notifications-supabase.ts"

window.Buffer = Buffer

export default function App() {
  const charAt = `

  ██        ██
  ▓▓   ▓▓
  ▒▒  ▒▒▒▒  ▒▒
  ▒▒▒▒    ▒▒▒▒
  ░░░      ░░░

`

  console.info(`%c${charAt}`, 'color: #4A34B8')

  useScrollToTop()

  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: 'Watchit Dapp',
          url: window.location.href,
        },
        openDeeplink: (url) => {
          const isMM = (window as any).ethereum?.isMetaMask
          if (typeof (window as any).ethereum === 'undefined' || !isMM) {
            // Mobile version / no extension
            window.location.href = 'https://metamask.app.link'
          } else {
            // Desktop with MetaMask extension
            window.location.href = url
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
  )
}

interface EventArgs {
  recipient?: string;
  origin?: string;
}
const AppContent = () => {
  const dispatch = useDispatch()
  const sessionData = useSelector((state: any) => state.auth.session)
  const { getNotifications } = useNotifications()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // Set the global reference so we can call notify(...) anywhere.
    setGlobalNotifier(enqueueSnackbar)
  }, [enqueueSnackbar])

  const watchEvent = (eventName: string, args: EventArgs, logText: string) => {
    return publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName,
      args,
      onLogs: (logs) => {
        console.log(logText, logs)
        dispatch(setBlockchainEvents(logs))
      },
    })
  }

  useEffect(() => {
    if (!sessionData?.address) return

    const events = [
      { name: 'FundsDeposited', args: { recipient: sessionData?.address }, logText: 'New deposit (user as recipient):' },
      { name: 'FundsWithdrawn', args: { origin: sessionData?.address }, logText: 'New withdraw (user as origin):' },
      { name: 'FundsTransferred', args: { origin: sessionData?.address }, logText: 'New transfer from me:' },
      { name: 'FundsTransferred', args: { recipient: sessionData?.address }, logText: 'New transfer to me:' },
      // { name: 'FundsLocked', args: { account: sessionData?.address }, logText: 'New funds locked:' },
      { name: 'FundsClaimed', args: { claimer: sessionData?.address }, logText: 'New funds claimed:' },
      // { name: 'FundsApproved', args: { from: sessionData?.address }, logText: 'New funds approved:' },
      // { name: 'FundsCollected', args: { from: sessionData?.address }, logText: 'New funds collected:' },
      // { name: 'FundsReleased', args: { to: sessionData?.address }, logText: 'New funds released:' },
    ]

    const cleanup = events.map(event => watchEvent(event.name, event.args, event.logText))
    return () => cleanup.forEach(unwatch => unwatch())
  }, [sessionData?.address])

  useEffect(() => {
    if (sessionData?.profile?.id) {
      subscribeToNotifications(sessionData?.profile?.id, dispatch, ['notifications'])
      getNotifications(sessionData?.profile?.id).then(() => { })
    }
  }, [sessionData?.profile?.id])

  return (
    <>
      <SettingsDrawer />
      <ProgressBar />
      <Router />
      <ResponsiveOverlay />
    </>
  )
}
