import BlankView from '../../sections/blank/view'
import ComingSoonView from '../../sections/coming-soon/view'
import { OgMetaTags } from '@src/components/og-meta-tags.tsx'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'

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
  )
}
