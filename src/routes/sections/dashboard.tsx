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
const MarketplacePage = lazy(() => import('src/pages/dashboard/marketplace'));
const EventsPage = lazy(() => import('src/pages/dashboard/events'));
const AchievementsPage = lazy(() => import('src/pages/dashboard/achievements'));
// GOVERNANCE
const GovernancePage = lazy(() => import('src/pages/dashboard/governance/list'));
const GovernanceNewPage = lazy(() => import('src/pages/dashboard/governance/new'));
const GovernanceDetailPage = lazy(() => import('src/pages/dashboard/governance/details'));
// MANAGEMENT
const AnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const StudioPage = lazy(() => import('src/pages/dashboard/studio'));
const OwnershipPage = lazy(() => import('src/pages/dashboard/ownership'));
const FinancePage = lazy(() => import('src/pages/dashboard/finance'));
const MarketingPage = lazy(() => import('src/pages/dashboard/marketing'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// PRODUCT
const MovieDetailsPage = lazy(() => import('src/pages/dashboard/movie/details'));
const MovieListPage = lazy(() => import('src/pages/dashboard/movie/list'));
const MovieCreatePage = lazy(() => import('src/pages/dashboard/movie/new'));
const MovieEditPage = lazy(() => import('src/pages/dashboard/movie/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));

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
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'studio', element: <StudioPage /> },
      { path: 'ownership', element: <OwnershipPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'marketing', element: <MarketingPage /> },
      {
        path: 'governance',
        children: [
          { element: <GovernancePage />, index: true },
          { path: 'details/:id', element: <GovernanceDetailPage /> },
          { path: 'new', element: <GovernanceNewPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'movie',
        children: [
          { element: <MovieListPage />, index: true },
          { path: 'list', element: <MovieListPage /> },
          { path: ':id', element: <MovieDetailsPage /> },
          { path: 'new', element: <MovieCreatePage /> },
          { path: ':id/edit', element: <MovieEditPage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
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
