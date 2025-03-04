// sections
// import { GovernanceListView } from '../../../sections/governance/views';
import { ComingSoonView } from '@src/sections/coming-soon';
import BlankView from '@src/sections/blank/views/blank-view.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function GovernanceList() {
  return (
    <OgMetaTags
      title="Watchit: Governance (COMING SOON)"
      description="Discover the latest decentralized creations on Watchit. Powered by Web3 & AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/governance`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
