import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import DashboardLayout from '@src/layouts/dashboard';
// components
import { LoadingScreen, SplashScreen } from '@src/components/loading-screen';
import CompactLayout from '@src/layouts/compact';


// ----------------------------------------------------------------------

// OVERVIEW
const ExplorePage = lazy(() => import('@src/pages/explore.tsx'));
const CommunityPage = lazy(() => import('@src/pages/community.tsx'));
const MarketplacePage = lazy(() => import('@src/pages/marketplace.tsx'));
const EventsPage = lazy(() => import('@src/pages/events.tsx'));
const AchievementsPage = lazy(() => import('@src/pages/achievements.tsx'));
// GOVERNANCE
const GovernancePage = lazy(() => import('@src/pages/governance/list'));
// MANAGEMENT
const AnalyticsPage = lazy(() => import('@src/pages/analytics.tsx'));
const StudioPage = lazy(() => import('@src/pages/studio.tsx'));
const OwnershipPage = lazy(() => import('@src/pages/ownership.tsx'));
const FinancePage = lazy(() => import('@src/pages/finance.tsx'));
const CollaborationsPage = lazy(() => import('@src/pages/collaborations.tsx'));
// MARKETING
const MarketingPage = lazy(() => import('@src/pages/marketing.tsx'));
const StrategyPage = lazy(() => import('@src/pages/marketing/index.tsx'));
// USER
const UserProfilePage = lazy(() => import('@src/pages/user/profile'));
// MOVIE
const PublicationDetailsPage = lazy(() => import('@src/pages/publication/details'));

const Page500 = lazy(() => import('@src/pages/500'));
const Page403 = lazy(() => import('@src/pages/403'));
const Page404 = lazy(() => import('@src/pages/404'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
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
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'studio', element: <StudioPage /> },
      { path: 'ownership', element: <OwnershipPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'collaborations', element: <CollaborationsPage /> },
      { path: 'marketing', element: <MarketingPage /> },
      { path: 'marketing/strategy/:id', element: <StrategyPage /> },
      { path: 'profile/:id', element: <UserProfilePage /> },
      {
        path: 'governance',
        children: [
          { element: <GovernancePage />, index: true },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
        ],
      },
      {
        path: 'publication',
        children: [
          { path: ':id', element: <PublicationDetailsPage /> },
        ],
      },
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
