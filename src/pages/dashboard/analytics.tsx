import BlankView from '../../sections/blank/view'
import ComingSoonView from '../../sections/coming-soon/view'
import { OgMetaTags } from '@src/components/og-meta-tags.tsx'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'

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
  )
}
