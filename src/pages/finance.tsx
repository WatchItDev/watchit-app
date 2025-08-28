import { FinanceView } from '@src/sections/finance';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { WithAuth } from '@src/components/should-login/withAuth.tsx';

const OverviewBankingPage = () => {
  return (
    <OgMetaTags
      title="Watchit: Finance Overview"
      description="Manage your tokens, track earnings, and power up your content creation. Experience the future of decentralized monetization."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/finance/`}
    >
      <Header>
        <HeaderContent title="Finance" />
      </Header>
      <WithAuth
        component={FinanceView}
        description={'Login to access your balance.'}
        icon={'iconoir:stats-report'}
        header={'Finance Dashboard'}
      />
    </OgMetaTags>
  );
};

export default OverviewBankingPage;
