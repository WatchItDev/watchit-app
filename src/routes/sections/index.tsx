import { Navigate, useRoutes } from 'react-router-dom'
import { dashboardRoutes } from './dashboard'
import NotFoundPage from '../../pages/404'
import { PATH_AFTER_LOGIN } from '@src/config-global'
export default function Router() {

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    ...dashboardRoutes,

    // No match 404
    { path: '404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
