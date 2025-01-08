import { Navigate, useRoutes } from 'react-router-dom';
import { GLOBAL_CONSTANTS, PATH_AFTER_LOGIN } from '@src/config-global';
import { dashboardRoutes } from './dashboard';
import NotFoundPage from '../../pages/404';
import { useEffect } from 'react';
import { subscribeToNotifications } from '@src/utils/subscribe-notifications-supabase.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { publicClientWebSocket } from '@src/clients/viem/publicClient.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { setBlockchainEvents } from '@redux/blockchain-events';
import { setGlobalNotifier } from '@notifications/internal-notifications.ts';
import { useSnackbar } from 'notistack';

export default function Router() {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { getNotifications } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Set the global reference so we can call notify(...) anywhere.
    setGlobalNotifier(enqueueSnackbar);
  }, [enqueueSnackbar]);

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

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    ...dashboardRoutes,

    // No match 404
    { path: '404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
