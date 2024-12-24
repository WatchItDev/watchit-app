import { Helmet } from 'react-helmet-async';
import OverviewBankingView from "@src/sections/finance";
import Header from "@src/layouts/dashboard/header.tsx";
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import withAuth from '@src/components/should-login/withAuth';

const OverviewBankingViewWithAuth = withAuth(OverviewBankingView, 'iconoir:stats-report', 'You need to log in to access this page');

export default function OverviewBankingPage() {
  return (
    <>
      <Helmet>
        <title> WatchIt | Finance</title>
      </Helmet>

      <Header>
        <HeaderContent title="Finance" />
      </Header>
      <OverviewBankingViewWithAuth />
    </>
  );
}
