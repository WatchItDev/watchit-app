import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsPage() {
  return (
    <OgMetaTags
      title="Watchit: Analytics (COMING SOON)"
      description="Gain insights into your content performance, audience engagement, and overall growth on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/analytics/`}
    >
      <BlankView>
        <ComingSoonView />
      </BlankView>
    </OgMetaTags>
  );
}
