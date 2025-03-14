import BlankView from '@src/sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '@src/sections/coming-soon';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

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
