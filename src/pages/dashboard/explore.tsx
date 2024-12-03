import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';
import HeaderContent from "@src/layouts/dashboard/HeaderContent.tsx";
import Header from '@src/layouts/dashboard/header.tsx';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <Header>
        <HeaderContent title="Explore" />
      </Header>
      <ExploreView />
    </>
  );
}
