import { OgMetaTags } from '@src/components/og-meta-tags.tsx'
import withAuth from '@src/components/should-login/withAuth'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'
import HeaderContent from '@src/layouts/dashboard/header-content.tsx'
import Header from '@src/layouts/dashboard/header.tsx'
import OverviewBankingView from '@src/sections/finance'

const OverviewBankingViewWithAuth = withAuth(
  OverviewBankingView,
  'iconoir:stats-report',
  'Login to access your balance.'
)

export default function OverviewBankingPage() {

  return (
    <OgMetaTags
      title="Watchit: Finance Overview"
      description="Manage your tokens, track earnings, and power up your content creation. Experience the future of decentralized monetization."
      url={`${GLOBAL_CONSTANTS.BASE_URL}/finance/`}
    >
      <Header>
        <HeaderContent title="Finance" />
      </Header>
      <OverviewBankingViewWithAuth />
    </OgMetaTags>
  )
}
