import { Navigate, useRoutes } from 'react-router-dom';
import { GLOBAL_CONSTANTS, PATH_AFTER_LOGIN } from '@src/config-global';
import { dashboardRoutes } from './dashboard';
import NotFoundPage from '../../pages/404';
import {useEffect} from "react";
import { subscribeToNotifications } from '@src/utils/subscribe-notifications-supabase.ts';
import { useDispatch, useSelector } from 'react-redux';
import {useNotifications} from "@src/hooks/use-notifications.ts";
import { publicClientWebSocket } from '@src/clients/viem/publicClient.ts';
import LedgerVaultAbi from '@src/config/abi/LedgerVault.json';
import { setBlockchainEvents } from '@redux/blockchain-events';

export default function Router() {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { getNotifications } = useNotifications();

  useEffect(() => {
    // TODO - Filter events by user
    const unwatchDeposit = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsDeposited',
      onLogs: (logs) => {
        console.log('New deposit event received:', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });
    const unwatchWithdraw = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsWithdrawn',
      onLogs: (logs) => {
        console.log('New withdraw event received:', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });
    const unwatchTransfer = publicClientWebSocket.watchContractEvent({
      address: GLOBAL_CONSTANTS.LEDGER_VAULT_ADDRESS,
      abi: LedgerVaultAbi.abi,
      eventName: 'FundsTransferred',
      onLogs: (logs) => {
        console.log('New withdraw event received:', logs);
        dispatch(setBlockchainEvents(logs));
      },
    });
    return () => {
      unwatchDeposit();
      unwatchWithdraw();
      unwatchTransfer();
    };
  }, []);

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
