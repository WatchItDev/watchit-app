import BlankView from '../sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '../sections/coming-soon';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function OverviewBookingPage() {
  return (
    <OgMetaTags
      title="Watchit: Community (COMING SOON)"
      description="Connect with fellow creators and supporters in a decentralized community powered by Web3 & AI."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/community/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
