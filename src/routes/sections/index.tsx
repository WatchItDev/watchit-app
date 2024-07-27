import { Navigate, useRoutes } from 'react-router-dom';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
//
import { dashboardRoutes } from './dashboard';
import NotFoundPage from '../../pages/404';
import Login from '../../pages/login';


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    {
      path: 'login',
      element: <Login />, // Add the login route
     },
    // Dashboard routes
    ...dashboardRoutes,

    // No match 404
    { path: '404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
