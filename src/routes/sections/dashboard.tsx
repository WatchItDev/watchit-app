import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

// OVERVIEW
const ExplorePage = lazy(() => import('src/pages/dashboard/explore'));
const CommunityPage = lazy(() => import('src/pages/dashboard/community'));
const GovernancePage = lazy(() => import('src/pages/dashboard/governance'));
const MarketplacePage = lazy(() => import('src/pages/dashboard/marketplace'));
const EventsPage = lazy(() => import('src/pages/dashboard/events'));
const AchievementsPage = lazy(() => import('src/pages/dashboard/achievements'));
// MANAGEMENT
const AnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const StudioPage = lazy(() => import('src/pages/dashboard/studio'));
const OwnershipPage = lazy(() => import('src/pages/dashboard/ownership'));
const FinancePage = lazy(() => import('src/pages/dashboard/finance'));
const MarketingPage = lazy(() => import('src/pages/dashboard/marketing'));

const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (

      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>

          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <ExplorePage />, index: true },
      { path: 'community', element: <CommunityPage /> },
      { path: 'governance', element: <GovernancePage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'studio', element: <StudioPage /> },
      { path: 'ownership', element: <OwnershipPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'marketing', element: <MarketingPage /> },
    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
        <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
