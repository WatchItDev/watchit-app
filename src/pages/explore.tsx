import { ExploreView } from '@src/sections/explore';
import HeaderContent from '@src/layouts/dashboard/header-content.tsx';
import Header from '@src/layouts/dashboard/header.tsx';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <OgMetaTags
      title="Watchit: Explore"
      description="Discover the latest decentralized creations on Watchit. Powered by Web3 & AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/`}
    >
      <Header>
        <HeaderContent title="Explore" />
      </Header>
      <ExploreView />
    </OgMetaTags>
  );
}
