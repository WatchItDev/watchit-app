import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { OgMetaTags } from '@src/components/og-meta-tags.tsx';
import HeaderContent from "@src/layouts/dashboard/header-content.tsx";
import Header from "@src/layouts/dashboard/header.tsx";
import {OverviewAnalyticsView} from "@src/sections/analytics/view";

// ----------------------------------------------------------------------

export default function OverviewAnalyticsPage() {
  return (
    <OgMetaTags
      title="Watchit: Analytics"
      description="Gain insights into your content performance, audience engagement, and overall growth on Watchit."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/analytics/`}
    >
      <Header>
        <HeaderContent title="Analytics" />
      </Header>

      <OverviewAnalyticsView />
    </OgMetaTags>
  );
}
