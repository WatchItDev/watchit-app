import BlankView from '../sections/blank/views/blank-view.tsx';
import { ComingSoonView } from '../sections/coming-soon';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function OverviewEcommercePage() {
  return (
    <OgMetaTags
      title="Watchit: Marketplace (COMING SOON)"
      description="Buy and sell exclusive content and NFTs in the Watchit Marketplace."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/marketplace/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
