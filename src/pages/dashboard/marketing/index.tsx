import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import Header from '@src/layouts/dashboard/header.tsx';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import { WithAuth } from '@src/components/should-login/withAuth.tsx';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import StrategyOverview from '@src/pages/dashboard/marketing/components/StrategyOverview.tsx';

const StrategyIndex = () => {
  return (
    <OgMetaTags
      title="Watchit: Strategy"
      description="Promote your content, engage audiences, and maximize visibility on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketing`}
    >
      <Header>
        <HeaderContent title="Marketing" />
      </Header>
      <WithAuth
        component={StrategyOverview}
        header={'Marketing Dashboard'}
        description={'Login to access your marketing overview.'}
        icon={'iconoir:megaphone'}
      />
    </OgMetaTags>
  );
};

export default StrategyIndex;
