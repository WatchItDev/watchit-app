import { Navigate, useRoutes } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from '@src/config-global';
import { dashboardRoutes } from './dashboard';
import NotFoundPage from '../../pages/404';
import {useEffect} from "react";
import { subscribeToNotifications } from '@src/utils/subscribe-notifications-supabase.ts';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import {ReadResult} from "@lens-protocol/react/dist/declarations/src/helpers/reads";
import {useNotifications} from "@src/hooks/use-notifications.ts";

export default function Router() {
  const dispatch = useDispatch();
  const sessionData = useSelector((state: any) => state.auth.session);
  const { getNotifications } = useNotifications();
  useEffect(() => {
    if (sessionData?.profile?.id) {
      // Subscribe to notifications channel
      subscribeToNotifications(sessionData?.profile?.id, dispatch);

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
